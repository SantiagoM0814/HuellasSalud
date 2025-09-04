package org.huellas.salud.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.huellas.salud.domain.mediaFile.MediaFile;
import org.huellas.salud.domain.mediaFile.MediaFileMsg;
import org.huellas.salud.domain.mediaFile.MediaUploadForm;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.utils.Utils;
import org.huellas.salud.repositories.MediaFileRepository;
import org.jboss.logging.Logger;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

@ApplicationScoped
public class MediaFileService {

    private static final Logger LOG = Logger.getLogger(MediaFileService.class);

    @Inject
    Utils utils;

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
}
