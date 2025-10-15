package org.huellas.salud.domain.service;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.huellas.salud.domain.mediaFile.MediaFile;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.huellas.salud.helper.validators.ValidationGroups;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Service implements Serializable {

    @BsonProperty("idServicio")
    @Schema(example = "faf32d41-65b2-431b-a468-0dbc6650ae47")
    @Null(message = "No debe enviar ningún valor en el campo idService", groups = ValidationGroups.Post.class)
    private String idService;

    @BsonProperty("nombre")
    @Schema(example = "Revisión general")
    @NotBlank(message = "El campo nombre no puede ser nulo o vacío")
    @Size(min = 5, max = 40, message = "El campo name debe contener entre 5 y 40 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9&\\-]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ0-9&\\-]+)*$",
            message = "El nombre no debe contener caracteres especiales no permitidos ni espacios vacíos al inicio o final")
    private String name;

    @BsonProperty("descripcionCorta")
    @Schema(example = "Chequeo completo del estado de salud de tu mascota: signos vitales, piel, pelaje, " +
            "ojos, oídos, boca, abdomen y articulaciones. Ideal para detectar problemas a tiempo y mantener " +
            "su bienestar.")
    @NotBlank(message = "El campo descripcion corta no puede ser nulo o vacio")
    @Size(min = 20, max = 250, message = "El campo descripcion corta debe contener entre 20 y 250 caracteres")
    private String shortDescription;

    @BsonProperty("descripcionLarga")
    @Schema(example = "La revisión general es un chequeo completo del estado de salud de la mascota. " +
            "Incluye la evaluación de signos vitales (temperatura, frecuencia cardíaca y respiratoria)," +
            " inspección de piel, pelaje, ojos, oídos, boca y dentadura, palpación abdominal, revisión " +
            "de extremidades y articulaciones, así como auscultación cardíaca y pulmonar. Este servicio " +
            "permite detectar de manera temprana enfermedades o condiciones que puedan afectar el " +
            "bienestar de la mascota, recomendando los cuidados preventivos o tratamientos necesarios.")
    @NotBlank(message = "El campo descripcion larga no puede ser nulo o vacio")
    @Size(min = 100, max = 500, message = "El campo descripcion larga debe contener entre 100 y 500 caracteres")
    private String longDescription;

    @BsonProperty("precioBase")
    @Schema(example = "50000")
    @NotNull(message = "El campo precio base no puede ser nulo o vacio")
    @Positive(message = "El valor del campo precio base debe ser mayor a 0")
    private double basePrice;

    @BsonProperty("precioPorKg")
    @Schema(example = "true")
    private boolean priceByWeight;

    @BsonProperty("estado")
    @NotNull(message = "El valor del campo state no puede ser nulo o vacío")
    @AssertTrue(message = "El valor del campo state debe ser true", groups = ValidationGroups.Post.class)
    private Boolean state;

    private List<WeightPriceRule> weightPriceRules;

    private MediaFile mediaFile;
}