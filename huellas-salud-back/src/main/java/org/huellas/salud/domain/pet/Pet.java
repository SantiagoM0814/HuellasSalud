package org.huellas.salud.domain.pet;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.huellas.salud.domain.mediaFile.MediaFile;
import org.huellas.salud.helper.validators.ValidPetInterface;
import org.huellas.salud.helper.validators.ValidationGroups;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@ValidPetInterface
@NoArgsConstructor
@AllArgsConstructor
public class Pet implements Serializable {

    @BsonProperty("idPropietario")
    @Schema(example = "1023456789")
    @NotBlank(message = "El campo idOwner no puede ser nulo o vacío")
    @Size(min = 7, max = 20, message = "El campo idOwner debe contener entre 7 y 20 caracteres")
    private String idOwner;

    @BsonProperty("identificador")
    @Null(message = "No debe enviar ningún valor en el campo idPet", groups = ValidationGroups.Post.class)
    private String idPet;

    @BsonProperty("nombre")
    @Schema(example = "Rex")
    @NotBlank(message = "El campo name no puede ser nulo o vacío")
    @Size(min = 3, max = 40, message = "El campo name debe contener entre 3 y 40 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$", message = "El nombre no debe contener " +
            "valores numéricos, ni caracteres especiales, ni espacios vacíos al inicio o al final")
    private String name;

    @BsonProperty("especie")
    @Schema(example = "Perro")
    @NotBlank(message = "El campo species no puede ser nulo o vacío")
    private String species;

    @BsonProperty("raza")
    @Schema(example = "Pastor alemán")
    @Size(min = 5, max = 25, message = "El campo bread debe contener entre 5 y 25 caracteres")
    private String breed;

    @BsonProperty("sexo")
    @Schema(example = "Macho")
    @NotBlank(message = "El campo sex no puede ser nulo o vacío")
    private String sex;

    @BsonProperty("edad")
    @Schema(example = "10 años")
    @NotBlank(message = "El campo age no puede ser nulo o vacío")
    private String age;

    @BsonProperty("peso")
    @Schema(example = "12 Kilogramos")
    @NotBlank(message = "El campo weight no puede ser nulo o vacío")
    private String weight;

    @BsonProperty("esterilizado")
    private boolean sterilized;

    @BsonProperty("discapacidad")
    @Schema(example = "Ninguna")
    private String disability;

    @BsonProperty("descripcion")
    @NotBlank(message = "El campo description no puede ser nulo o vacío")
    @Size(min = 10, max = 200, message = "El campo description debe contener entre 10 y 200 caracteres")
    private String description;

    @BsonProperty("activo")
    @NotNull(message = "El valor del campo isActive no puede ser nulo o vacío")
    @AssertTrue(message = "El valor del campo isActive debe ser true", groups = ValidationGroups.Post.class)
    private Boolean isActive;

    @BsonProperty("historialMedico")
    private List<MedicalHistory> medicalHistory;

    private MediaFile mediaFile;
}
