package org.huellas.salud.repositories;

import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.huellas.salud.domain.mediaFile.MediaFileMsg;
import org.jboss.logging.Logger;

import java.util.Optional;

@ApplicationScoped
public class MediaFileRepository implements PanacheMongoRepository<MediaFileMsg> {

    private static final Logger LOG = Logger.getLogger(MediaFileRepository.class);

    public Optional<MediaFileMsg> getMediaByEntityTypeAndId(String entityType, String entityId) {

        LOG.infof("@getMediaByEntityTypeAndId REPO > Inicia consulta de registro con entity type: %s y " +
                "entity Id: %s", entityType, entityId);

        return find("data.tipoEntidad = ?1 AND data.identificador = ?2", entityType, entityId)
                .firstResultOptional();
    }
}
