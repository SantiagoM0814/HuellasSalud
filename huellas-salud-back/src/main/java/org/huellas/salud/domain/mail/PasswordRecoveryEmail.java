package org.huellas.salud.domain.mail;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.huellas.salud.domain.user.User;
import org.huellas.salud.helper.utils.ConvertFormatJSON;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@MongoEntity(collection = "CorreoRecuperacion")
public class PasswordRecoveryEmail {

    @BsonProperty("codigoAprobacion")
    private String approvalCode;

    @BsonProperty("recuperado")
    private boolean recovered;

    @BsonProperty("enlaceRecuperacion")
    private String resetLink;

    @BsonProperty("fechaVigencia")
    private LocalDateTime validityDate;

    @BsonProperty("fechaSolicitud")
    private LocalDateTime requestDate;

    @BsonProperty("usuario")
    private User dataUser;

    @Override
    public String toString() {
        return ConvertFormatJSON.toJson(this);
    }
}
