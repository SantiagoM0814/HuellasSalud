package org.huellas.salud.repositories;

import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.huellas.salud.domain.mail.EmailConfirmation;
import org.jboss.logging.Logger;

import java.util.Optional;

@ApplicationScoped
public class EmailConfirmationRepository implements PanacheMongoRepository<EmailConfirmation> {

    private static final Logger LOG = Logger.getLogger(EmailConfirmationRepository.class);

    public Optional<EmailConfirmation> getEmailConfirmByCode(String approvalCode) {

        LOG.infof("@getEmailConfirmByCode REPO > Inicia consulta de registro confirmacion de codigo: %s", approvalCode);

        return find("contexto.codigoAprobacion = ?1", approvalCode).firstResultOptional();
    }
}
