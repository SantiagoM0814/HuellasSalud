package org.huellas.salud.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.huellas.salud.domain.Meta;
import org.huellas.salud.domain.mediaFile.MediaFile;
import org.huellas.salud.domain.mediaFile.MediaFileMsg;
import org.huellas.salud.domain.mediaFile.MediaUploadForm;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.jwt.JwtService;
import org.huellas.salud.helper.utils.Utils;
import org.huellas.salud.repositories.MediaFileRepository;
import org.jboss.logging.Logger;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

@ApplicationScoped
public class MediaFileService {

    private static final Logger LOG = Logger.getLogger(MediaFileService.class);

    @Inject
    Utils utils;

    @Inject
    JwtService jwtService;

    @Inject
    MediaFileRepository mediaFileRepository;

    public MediaFile getMedia(String entityType, String entityId) throws HSException {

        LOG.infof("@getMedia SERV > Inicia servicio para obtener imagen de la entidad: %s", entityId);

        MediaFileMsg mediaFile = mediaFileRepository.getMediaByEntityTypeAndId(entityType, entityId).orElseThrow(() -> {

            LOG.errorf("@getMedia SERV > El tipo de entidad: %s con ID: %s No tiene une imagen asociada",
                    entityType, entityId);

            return new HSException(Response.Status.NOT_FOUND, "");
        });

        LOG.infof("@getMedia SERV > Finaliza servicio para obtener imagen de la entidad: %s", entityId);

        return mediaFile.getData();
    }

    public MediaFile saveFile(String entityType, String entityId, MediaUploadForm mediaUploadForm) throws HSException {

        LOG.info("@saveFile SERV > Inicia servicio de guardado del archivo de la imagen del usuario");

        Path uploadPath = mediaUploadForm.getFileUpload().uploadedFile();

        try (InputStream inputStream = Files.newInputStream(uploadPath)) {

            byte[] imageBytes = inputStream.readAllBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            MediaFile mediaFile = MediaFile.builder()
                    .entityId(entityId)
                    .entityType(entityType)
                    .fileName(mediaUploadForm.getFileUpload().fileName())
                    .contentType(mediaUploadForm.getFileUpload().contentType())
                    .fileType(mediaUploadForm.getFileUpload().contentType().split("/")[0])
                    .attachment(base64Image)
                    .build();

            mediaFileRepository.persist(MediaFileMsg.builder()
                    .data(mediaFile)
                    .meta(utils.getMetaToEntity())
                    .build());

            LOG.info("@saveFile SERV > Finaliza servicio de guardado del archivo de la imagen del usuario");

            return mediaFile;

        } catch (Exception ex) {

            LOG.errorf(ex, "@saveFile SERV > Se presento un error al guardar imagen en la base de datos");

            throw new HSException(Response.Status.INTERNAL_SERVER_ERROR, "Error al guardar imagen en base datos");
        }
    }

    public void updateMediaFileInMongo(String entityType, String entityId, MediaUploadForm form) throws HSException {
        LOG.infof("@updateMediaFileInMongo SERV > Inicia actualización para entityType: %s y entityId: %s",
                entityType, entityId);

        MediaFileMsg mediaMsgMongo = getMediaMsg(entityType, entityId);

        LOG.infof("@updateMediaFileInMongo SERV > Media encontrado, inicia actualización. Data anterior: %s",
                mediaMsgMongo);

        setMediaInformation(entityType, entityId, form, mediaMsgMongo);

        LOG.infof("@updateMediaFileInMongo SERV > Finaliza edición de información. Guardando en Mongo. Data final: %s",
                mediaMsgMongo);

        mediaFileRepository.update(mediaMsgMongo);


        LOG.infof("@updateMediaFileInMongo SERV > Finaliza actualización del media con entityId: %s", entityId);

    }

    private MediaFileMsg getMediaMsg(String entityType, String entityId) throws HSException {
        MediaFileMsg media = mediaFileRepository.getMediaByEntityTypeAndId(entityType, entityId).orElseThrow(() -> {

            LOG.errorf("@getMedia SERV > El tipo de entidad: %s con ID: %s No tiene une imagen asociada",
                    entityType, entityId);

            return new HSException(Response.Status.NOT_FOUND, "");
        });

        if (media == null) {
            LOG.errorf("@getMediaMsg SERV > No existe media con entityType: %s y entityId: %s", entityType, entityId);
            throw new HSException(Response.Status.NOT_FOUND,
                    "No se encontró media con entityType: " + entityType + " y entityId: " + entityId);
        }
        return media;
    }

    /**
     * Actualiza los datos del media (similar a setPetInformation)
     */
    private void setMediaInformation(String entityType, String entityId, MediaUploadForm form, MediaFileMsg mediaMsgMongo) {
        LOG.infof("@setMediaInformation SERV > Inicia set de datos de media para entityType: %s y entityId: %s",
                entityType, entityId);

        MediaFile mediaMongo = mediaMsgMongo.getData();
        Meta metaMongo = mediaMsgMongo.getMeta();

        try {
            Path uploadPath = form.getFileUpload().uploadedFile();
            byte[] imageBytes = Files.readAllBytes(uploadPath);
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            mediaMongo.setFileName(form.getFileUpload().fileName());
            mediaMongo.setContentType(form.getFileUpload().contentType());
            mediaMongo.setFileType(form.getFileUpload().contentType().split("/")[0]);
            mediaMongo.setAttachment(base64Image);

        } catch (Exception e) {
            LOG.errorf(e, "@setMediaInformation SERV > Error al procesar archivo subido");
            throw new RuntimeException("Error procesando archivo subido", e);
        }

        // Meta
        metaMongo.setLastUpdate(LocalDateTime.now());
        metaMongo.setNameUserUpdated(jwtService.getCurrentUserName());
        metaMongo.setEmailUserUpdated(jwtService.getCurrentUserEmail());
        metaMongo.setRoleUserUpdated(jwtService.getCurrentUserRole());

        LOG.infof("@setMediaInformation SERV > Finaliza set de datos de media para entityId: %s", entityId);
    }
}
