package org.huellas.salud.domain.mail;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.Builder;
import lombok.Data;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.huellas.salud.helper.utils.ConvertFormatJSON;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@MongoEntity(collection = "EntregaEmail")
public class EmailDelivery {

    @BsonProperty("IdEntrega")
    private String deliveryId;

    @BsonProperty("descripcion")
    private String description;

    @BsonProperty("destinatarios")
    private List<String> recipient;

    @BsonProperty("fechaEnvio")
    private LocalDateTime dateOfShipment;

    @BsonProperty("estado")
    private String status;

    @BsonProperty("asunto")
    private String subject;

    @BsonProperty("tipo")
    private String type;

    @Override
    public String toString() {
        return ConvertFormatJSON.toJson(this);
    }
}
