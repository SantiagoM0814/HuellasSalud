package org.huellas.salud.domain.invoice;

import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.huellas.salud.helper.utils.ConvertFormatJSON;
import io.quarkus.mongodb.panache.common.MongoEntity;
import jakarta.validation.constraints.*;
import org.huellas.salud.domain.Meta;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import jakarta.validation.Valid;
import org.bson.types.ObjectId;
import lombok.Data;

@Data
@NoArgsConstructor
@AllArgsConstructor
@MongoEntity(collection = "FacturaMsg")
public class InvoiceMsg {

    @Schema(hidden = true)
    @Null(message = "No debe ingresar valor para el campo id")
    private ObjectId id;

    @Valid
    @NotNull(message = "El campo data no puede ser nulo")
    private Invoice data;

    @Null(message = "No debe ingresar valor para el campo meta")
    private Meta meta;

    @Override
    public String toString() {
        return ConvertFormatJSON.toJson(this);
    }
}