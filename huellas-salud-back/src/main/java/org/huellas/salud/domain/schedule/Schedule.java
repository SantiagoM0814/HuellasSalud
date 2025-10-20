package org.huellas.salud.domain.schedule;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.DayOfWeek;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.huellas.salud.helper.validators.ValidationGroups;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Schedule implements Serializable {

    @BsonProperty("idHorario")
    @Schema(example = "faf32d41-65b2-431b-a468-0dbc6650ae47")
    @Null(message = "No debe enviar ningún valor en el campo idSchedule", groups = ValidationGroups.Post.class)
    private String idSchedule;

    @BsonProperty("idVeterinario")
    @Schema(example = "e8f0c326-a478-490f-a88b-073aec86da4b")
    @NotBlank(message = "Debe asociar un veterinario")
    private String idVeterinarian;

    @BsonProperty("diaSemana")
    @Schema(example = "MONDAY")
    @NotNull(message = "Debe indicar el día de la semana")
    private DayOfWeek dayOfWeek;

    @BsonProperty("horaInicio")
    @Schema(example = "08:00")
    @NotNull(message = "Debe especificar la hora de inicio")
    private LocalTime startTime;

    @BsonProperty("horaFin")
    @Schema(example = "17:00")
    @NotNull(message = "Debe especificar la hora de fin")
    private LocalTime endTime;

    @BsonProperty("inicioAlmuerzo")
    @Schema(example = "12:00")
    private LocalTime lunchStart;

    @BsonProperty("finAlmuerzo")
    @Schema(example = "13:00")
    private LocalTime lunchEnd;

    @BsonProperty("activo")
    @Schema(example = "true")
    private boolean active;
}
