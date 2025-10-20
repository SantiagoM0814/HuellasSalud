package org.huellas.salud.repositories;

import org.huellas.salud.domain.announcement.AnnouncementMsg;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import io.quarkus.panache.common.Sort;
import org.jboss.logging.Logger;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@ApplicationScoped
public class AnnouncementRepository implements PanacheMongoRepository<AnnouncementMsg> {

    private final Logger LOG = Logger.getLogger(AnnouncementRepository.class);

    public List<AnnouncementMsg> getListAnnouncementMongo() {

        LOG.infof("@getListAnnouncementMongo REPO > Inicia obtencion de los anuncios registrados en mongo, estos se "
                + "retornaran ordenados de manera descendente por el campo de fecha de creacion");

        return listAll(Sort.descending("meta.fechaCreacion"));
    }

    public Optional<AnnouncementMsg> findAnnouncementById(String idAnnouncement) {

        LOG.infof("@findAnnouncementById REPO > Inicia busqueda del registro del anuncio con id: %s", idAnnouncement);

        return find("data.idAnuncio = ?1", idAnnouncement).firstResultOptional();
    }

    public long deleteAnnouncementDataMongo(String idAnnouncement) {

        LOG.infof("@deleteAnnouncementDataMongo REPO > Inicia servicio de eliminacion del anuncio con el id: %s "
                + "en mongo", idAnnouncement);

        return delete("data.idAnuncio = ?1", idAnnouncement);
    }

    public long deactivateExpiredAnnouncements() {
        LOG.info("@deactivateExpiredAnnouncements REPO > Inicia proceso de desactivación de anuncios vencidos");

        LocalDateTime limitDate = LocalDateTime.now().minusDays(7);

        List<AnnouncementMsg> expiredAnnouncements = find(
                "data.estado = ?1 and data.fechaActivacion < ?2", true, limitDate
        ).list();

        for (AnnouncementMsg msg : expiredAnnouncements) {
            msg.getData().setStatus(false);
            update(msg);
        }

        LOG.infof("Se desactivaron %d anuncios vencidos", expiredAnnouncements.size());

        return expiredAnnouncements.size();
    }
}
