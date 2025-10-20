package org.huellas.salud.scheduler;

import org.huellas.salud.repositories.AnnouncementRepository;
import jakarta.enterprise.context.ApplicationScoped;
import io.quarkus.scheduler.Scheduled;
import org.jboss.logging.Logger;
import jakarta.inject.Inject;

@ApplicationScoped
public class AnnouncementScheduler {

    private static final Logger LOG = Logger.getLogger(AnnouncementScheduler.class);

    @Inject
    AnnouncementRepository announcementRepository;

    // Para ejecutar cada minuto "0 * * * * ?"
    // Ejecuta cada 5 minutos
    @Scheduled(cron = "0 */5 * * * ?")
    void deactivateOldAnnouncements() {
        LOG.info("@deactivateOldAnnouncements SCH > Inicia desactivación automática de anuncios");
        long count = announcementRepository.deactivateExpiredAnnouncements();
        LOG.infof("@deactivateOldAnnouncements SCH > Finaliza desactivación: %s anuncios desactivados automáticamente", count);
    }
}
