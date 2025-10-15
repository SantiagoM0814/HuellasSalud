package org.huellas.salud.domain.appointment;

import jakarta.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.huellas.salud.helper.validators.ValidationGroups;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment implements Serializable {

    @BsonProperty("idCita")
    @Schema(example = "faf32d41-65b2-431b-a468-0dbc6650ae47")
    @Null(message = "No debe enviar ningún valor en el campo idService", groups = ValidationGroups.Post.class)
    private String idAppointment;

    @BsonProperty("idPropietario")
    @Schema(example = "faf32d41-65b2-431b-a468-0dbc6650ae47")
    @NotBlank(message = "Debe asociar un propietario")
    private String idOwner;

    @BsonProperty("idMascota")
    @Schema(example = "faf32d41-65b2-431b-a468-0dbc6650ae47")
    @NotBlank(message = "Debe asociar una mascota")
    private String idPet;

    @BsonProperty("servicios")
    @Schema(example = "Revisión general")
    @NotNull(message = "Debe incluir al menos un servicio")
    private List<String> services;

    @BsonProperty("fechaHora")
    @Schema(example = "12/10/2025:12:00:00")
    @FutureOrPresent(message = "La fecha debe ser actual o futura")
    private LocalDateTime dateTime;

    @BsonProperty("estado")
    @Schema(example = "pendiente")
    private String status;

    @BsonProperty("observaciones")
    @Schema(example = "La mascota presenta tos y falta de apetito")
    private String notes;

    @BsonProperty("idVeterinario")
    @Schema(example = "faf32d41-65b2-431b-a468-0dbc6650ae47")
    private String idVeterinarian;
}