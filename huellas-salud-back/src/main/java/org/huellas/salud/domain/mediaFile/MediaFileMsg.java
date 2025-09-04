package org.huellas.salud.domain.mediaFile;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.quarkus.mongodb.panache.common.MongoEntity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.huellas.salud.domain.Meta;
import org.huellas.salud.helper.utils.ConvertFormatJSON;
import org.huellas.salud.helper.utils.MediaFileSerializer;
import org.huellas.salud.helper.validators.ValidationGroups;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@MongoEntity(collection = "MediaFileMsg")
public class MediaFileMsg implements Serializable {

    @Schema(hidden = true)
    @Null(message = "No debe ingresar el campo id", groups = {ValidationGroups.Post.class, ValidationGroups.Put.class,
            ValidationGroups.Post_Get.class})
    private ObjectId id;

    @Valid
    @JsonSerialize(using = MediaFileSerializer.class)
    @NotNull(message = "El campo data no puede ser nulo", groups = {ValidationGroups.Post.class,
            ValidationGroups.Put.class, ValidationGroups.Post_Get.class})
    private MediaFile data;

    @Null(message = "No debe ingresar el campo meta", groups = {ValidationGroups.Post.class, ValidationGroups.Put.class,
            ValidationGroups.Post_Get.class})
    private Meta meta;

    @Override
    public String toString() {
        return ConvertFormatJSON.toJson(this);
    }

}
