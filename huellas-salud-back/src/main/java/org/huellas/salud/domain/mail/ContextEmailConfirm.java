package org.huellas.salud.domain.mail;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.codecs.pojo.annotations.BsonProperty;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContextEmailConfirm {

    @BsonProperty("codigoAprobacion")
    private String approvalCode;

    @BsonProperty("confirmada")
    private boolean confirmed;

    @BsonProperty("fechaVigencia")
    private LocalDateTime validityDate;

    @BsonProperty("fechaConfirmacion")
    private LocalDateTime confirmationDate;

    @BsonProperty("fechaSolicitud")
    private LocalDateTime requestDate;

    @BsonProperty("enlaceConfirmacion")
    private String confirmationLink;
}
