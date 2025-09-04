package org.huellas.salud.domain.mail;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.Builder;
import lombok.Data;
import org.huellas.salud.domain.user.User;

import java.time.LocalDateTime;

@Data
@Builder
@MongoEntity(collection = "CorreoVerificacion")
public class MailVerification {

    private boolean verified;
    private String approvalCode;
    private LocalDateTime effectiveDate;
    private LocalDateTime dateVerified;
    private User dataUser;
}
