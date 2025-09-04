package org.huellas.salud.domain.mail;

import io.quarkus.mongodb.panache.common.MongoEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.bson.types.ObjectId;
import org.huellas.salud.domain.user.User;
import org.huellas.salud.helper.utils.ConvertFormatJSON;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@MongoEntity(collection = "ConfirmacionCorreo")
public class EmailConfirmation {

    private ObjectId id;

    @BsonProperty("contexto")
    private ContextEmailConfirm context;

    private User data;

    @Override
    public String toString() {
        return ConvertFormatJSON.toJson(this);
    }
}
