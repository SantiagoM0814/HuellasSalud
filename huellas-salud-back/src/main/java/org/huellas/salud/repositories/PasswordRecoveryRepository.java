package org.huellas.salud.repositories;

import io.quarkus.mongodb.panache.PanacheMongoRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import org.huellas.salud.domain.mail.PasswordRecoveryEmail;

import java.util.Optional;

@ApplicationScoped
public class PasswordRecoveryRepository implements PanacheMongoRepositoryBase<PasswordRecoveryEmail, String> {

    public Optional<PasswordRecoveryEmail> findByApprovalCode(String approvalCode) {
        return find("codigoAprobacion", approvalCode).firstResultOptional();
    }
}
