package org.huellas.salud.domain.pet;

import lombok.Data;
import jakarta.validation.constraints.*;
import org.bson.codecs.pojo.annotations.BsonProperty;

import java.time.LocalDateTime;

@Data
public class Vaccine {

    @BsonProperty("nombre")
    @NotBlank(message = "El nombre de la vacuna no puede estar vacío")
    private String name;

    @BsonProperty("fechaAplicación")
    @NotNull(message = "La fecha de aplicación es obligatoria")
    private LocalDateTime dateApplied;

    @BsonProperty("fechaVencimiento")
    @Future(message = "La fecha de vencimiento debe ser en el futuro")
    private LocalDateTime validUntil;

    @BsonProperty("dosisUnica")
    private boolean singleDose;
}