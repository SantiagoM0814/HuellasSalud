package org.huellas.salud.domain.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.quarkus.mongodb.panache.common.MongoEntity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.huellas.salud.domain.Meta;
import org.huellas.salud.helper.utils.ConvertFormatJSON;
import org.huellas.salud.helper.utils.UserSerializer;
import org.huellas.salud.helper.validators.ValidUserInterface;
import org.huellas.salud.helper.validators.ValidationGroups;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ValidUserInterface
@MongoEntity(collection = "UsuarioMsg")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserMsg implements Serializable {

    @Schema(hidden = true)
    @Null(message = "No debe ingresar el campo id", groups = {ValidationGroups.Post.class, ValidationGroups.Put.class,
            ValidationGroups.Post_Get.class})
    private ObjectId id;

    @Valid
    @JsonSerialize(using = UserSerializer.class)
    @NotNull(message = "El campo data no puede ser nulo", groups = {ValidationGroups.Post.class,
            ValidationGroups.Put.class, ValidationGroups.Post_Get.class})
    private User data;

    @Null(message = "No debe ingresar el campo meta", groups = {ValidationGroups.Post.class, ValidationGroups.Put.class,
            ValidationGroups.Post_Get.class})
    private Meta meta;

    @Schema(example = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSU")
    private String token;

    @Override
    public String toString() {
        return ConvertFormatJSON.toJson(this);
    }
}
