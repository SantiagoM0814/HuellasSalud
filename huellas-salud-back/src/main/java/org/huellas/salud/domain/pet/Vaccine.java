package org.huellas.salud.domain.pet;

import lombok.Data;
import jakarta.validation.constraints.*;
import org.bson.codecs.pojo.annotations.BsonProperty;

import java.time.LocalDate;

@Data
public class Vaccine {

    @BsonProperty("nombre")
    @NotBlank(message = "El nombre de la vacuna no puede estar vacío")
    private String name;

    @BsonProperty("fechaAplicación")
    @NotNull(message = "La fecha de aplicación es obligatoria")
    private LocalDate dateApplied;

    @BsonProperty("fechaVencimiento")
    @Future(message = "La fecha de vencimiento debe ser en el futuro")
    private LocalDate validUntil;

    @BsonProperty("dosisUnica")
    private boolean singleDose;
}