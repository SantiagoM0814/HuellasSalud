package org.huellas.salud.domain.pet;

import lombok.Data;
import jakarta.validation.constraints.*;
import org.bson.codecs.pojo.annotations.BsonProperty;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class MedicalHistory {

    @BsonProperty("fecha")
    @NotNull(message = "La fecha es obligatoria")
    private LocalDateTime date;

    @BsonProperty("diagnostico")
    @NotBlank(message = "El diagnóstico no puede estar vacío")
    private String diagnostic;

    @BsonProperty("tratamiento")
    private String treatment;

    @BsonProperty("veterinario")
    @NotBlank(message = "El nombre del veterinario es obligatorio")
    private String veterinarian;

    @BsonProperty("cirugias")
    private List<String> surgeries;

    @BsonProperty("vacunas")
    private List<Vaccine> vaccines;
}
