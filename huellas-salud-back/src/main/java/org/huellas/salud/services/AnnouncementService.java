package org.huellas.salud.services;

import io.quarkus.cache.CacheInvalidateAll;
import io.quarkus.cache.CacheResult;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.huellas.salud.domain.Meta;
import org.huellas.salud.domain.announcement.Announcement;
import org.huellas.salud.domain.announcement.AnnouncementMsg;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.jwt.JwtService;
import org.huellas.salud.helper.utils.Utils;
import org.huellas.salud.repositories.MediaFileRepository;
import org.huellas.salud.repositories.AnnouncementRepository;
import org.jboss.logging.Logger;

import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.Optional;

@ApplicationScoped
public class AnnouncementService {

    private static final Logger LOG = Logger.getLogger(AnnouncementService.class);

    @Inject
    Utils utils;

    @Inject
    JwtService jwtService;

    @Inject
    AnnouncementRepository announcementRepository;

    @Inject
    MediaFileRepository mediaFileRepository;

    @CacheInvalidateAll(cacheName = "announcements-list-cache")
    public AnnouncementMsg saveAnnouncementDataMongo(AnnouncementMsg announcementMsg) throws HSException, UnknownHostException {

        LOG.infof("@saveAnnouncementDataMongo SERV > Inicia ejecucion de servicio para almacenar el registro de un "
                + "anuncio con la data: %s.", announcementMsg.getData());

        Announcement announcementData = announcementMsg.getData();

        LOG.infof("@saveAnnouncementDataMongo SERV > Inicia almacenamiento del registro en mongo con la data: %s", announcementData);

        announcementData.setStatus(false);
        announcementData.setActivatedAt(null);
        announcementMsg.setMeta(utils.getMetaToEntity());
        announcementData.setIdAnnouncement(UUID.randomUUID().toString());

        announcementRepository.persist(announcementMsg);

        LOG.infof("@saveAnnouncementDataMongo SERV > El anuncio se registro exitosamente en la base de datos. Finaliza "
                + "ejecucion de servicio para almacenar el registro de un anuncio con la data: %s", announcementMsg);

        return announcementMsg;
    }

    @CacheResult(cacheName = "announcements-list-cache")
    public List<AnnouncementMsg> getListAnnouncementMsg() {

        LOG.infof("@getListAnnouncementMsg SERV > Inicia ejecucion del servicio para obtener listado de los anuncios desde "
                + "mongo. Inicia consulta a mongo para obtener la informacion");

        List<AnnouncementMsg> announcements = announcementRepository.getListAnnouncementMongo();

        announcements.forEach(announcementMsg -> {
            mediaFileRepository.getMediaByEntityTypeAndId("ANNOUNCEMENT", announcementMsg.getData().getIdAnnouncement())
                    .ifPresent(media -> announcementMsg.getData().setMediaFile(media.getData()));
        });

        LOG.infof("@getListAnnouncementMsg SERV > Finaliza consulta en mongo. Finaliza ejecucion del servicio para "
                + "obtener el listado de los anuncios desde mongo. Se obtuvo: %s registros", announcements.size());

        return announcements;
    }

    @CacheInvalidateAll(cacheName = "announcements-list-cache")
    public void updateAnnouncementDataMongo(AnnouncementMsg announcementMsg) throws HSException {
        LOG.infof("@updateAnnouncementDataMongo SERV > Inicia ejecucion del servicio para actualizar el registro de un "
                + "anuncio con el id: %s. Data a modificar: %s", announcementMsg.getData().getIdAnnouncement(), announcementMsg);

        AnnouncementMsg announcementMsgMongo = getAnnouncementMsg(announcementMsg.getData().getIdAnnouncement());

        LOG.infof("@updateAnnouncementDataMongo SERV > El anuncio con id: %s si esta registrado. Inicia la "
                + "actualizacion del registro del anuncio con data; %s", announcementMsg.getData().getIdAnnouncement(), announcementMsg);

        setAnnouncementInformation(announcementMsg.getData().getIdAnnouncement(), announcementMsg.getData(), announcementMsgMongo);

        LOG.infof("@updateAnnouncementDataMongo SERV > Finaliza edicion de la informacion del anuncio con id: %s. "
                + "Inicia actualizacion del registro en mongo con la data: %s", announcementMsg.getData().getIdAnnouncement(), announcementMsg);

        announcementRepository.update(announcementMsgMongo);

        LOG.infof("updateAnnouncementDataMongo SERV > Finaliza actualizacion del registro del anuncio con id: %s. "
                + "Finaliza ejecucion del servicio de actualizacion", announcementMsg.getData().getIdAnnouncement());
    }

    @CacheInvalidateAll(cacheName = "announcements-list-cache")
    public void deleteAnnouncementDataMongo(String idAnnouncement) throws HSException {
        LOG.infof("@deleteAnnouncementDataMongo SERV > Inicia ejecucion del servicio para eliminar el registro de un "
                + "anuncio con el id: %s de mongo", idAnnouncement);

        long deleted = announcementRepository.deleteAnnouncementDataMongo(idAnnouncement);

        if (deleted == 0) {

            LOG.errorf("@deleteAnnouncementDataMongo SERV > El registro del anuncio con id: %s no "
                    + "existe en mongo. No se realiza eliminacion. Registros eliminados: %s", idAnnouncement, deleted);

            throw new HSException(Response.Status.NOT_FOUND, "El anuncio con id: " + idAnnouncement + "No esta "
                    + "registrado en la base de datos.");
        }

        LOG.infof("@deleteAnnouncementDataMongo SERV > El registro del anuncio con id: %s se elimino correctamente de "
                + "mongo. Finaliza ejecucion del servicio para eliminar anuncio y se elimino %s registro de la base "
                + "de datos", idAnnouncement, deleted);
    }

    private void setAnnouncementInformation(String idAnnouncement, Announcement announcementRequest, AnnouncementMsg announcementMsgMongo) {

        LOG.infof("@setAnnouncementInformation SERV > Inicia set de los datos del anuncio con id: %s", idAnnouncement);

        Announcement announcementMongo = announcementMsgMongo.getData();
        Meta metaMongo = announcementMsgMongo.getMeta();

        announcementMongo.setDescription(announcementRequest.getDescription());
        announcementMongo.setCellPhone(announcementRequest.getCellPhone());
        announcementMongo.setStatus(announcementRequest.getStatus());
        announcementMongo.setActivatedAt(LocalDateTime.now());
        

        metaMongo.setLastUpdate(LocalDateTime.now());
        metaMongo.setNameUserUpdated(jwtService.getCurrentUserName());
        metaMongo.setEmailUserUpdated(jwtService.getCurrentUserEmail());
        metaMongo.setRoleUserUpdated(jwtService.getCurrentUserRole());

        LOG.infof("@setAnnouncementInformation SERV > Finaliza set de los datos del anuncio con id: %s", idAnnouncement);
    }

    private AnnouncementMsg getAnnouncementMsg(String idAnnouncement) throws HSException {

        return announcementRepository.findAnnouncementById(idAnnouncement).orElseThrow(() -> {

            LOG.errorf("@getAnnouncementMsg SERV > El anuncio con id: %s No esta registrado."
                    + " Solicitud invalida no se puede modificado el registro", idAnnouncement);

            return new HSException(Response.Status.NOT_FOUND, "No se encontro el registro del anuncio con id: " + idAnnouncement
                    + " en la base de datos");
        });
    }

    public AnnouncementMsg getAnnouncementById(String idAnnouncement) {

        LOG.infof("@getAnnouncementById SERV > Inicia la ejecucion del servicio para obtener el anuncio con id:"
                + " %s. Inicia consulta en mongo.", idAnnouncement);

        Optional<AnnouncementMsg> optionalAnnouncement = announcementRepository.findAnnouncementById(idAnnouncement);

        if (optionalAnnouncement.isEmpty()) {
            LOG.warnf("@getAnnouncementById SERV > No se encontro ningun anuncio con el id: %s", idAnnouncement);
            return null;
        }

        AnnouncementMsg announcement = optionalAnnouncement.get();

        mediaFileRepository.getMediaByEntityTypeAndId("ANNOUNCEMENT", announcement.getData().getIdAnnouncement())
                .ifPresent(media -> announcement.getData().setMediaFile(media.getData()));

        LOG.infof("@getAnnouncementById SERV > Finaliza consulta de anuncio en mongo. Se obtuvo el registro "
                + "del anuncio con id: %s", idAnnouncement);

        return announcement;
    }
}
