package org.huellas.salud.domain.appointment;

import jakarta.validation.constraints.*;
import jakarta.validation.Valid;

import io.quarkus.mongodb.panache.common.MongoEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.huellas.salud.domain.Meta;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.bson.types.ObjectId;
import org.huellas.salud.helper.utils.ConvertFormatJSON;

@Data
@NoArgsConstructor
@AllArgsConstructor
@MongoEntity(collection = "CitaMsg")
public class AppointmentMsg {

    @Schema(hidden = true)
    @Null(message = "No debe ingresar valor para el campo id")
    private ObjectId id;

    @Valid
    @NotNull(message = "El campo data no puede ser nulo")
    private Appointment data;

    @Null(message = "No debe ingresar valor para el campo meta")
    private Meta meta;

    @Override
    public String toString() {
        return ConvertFormatJSON.toJson(this);
    }
}