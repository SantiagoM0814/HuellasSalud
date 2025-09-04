package org.huellas.salud.domain.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import lombok.*;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.huellas.salud.domain.mediaFile.MediaFile;
import org.huellas.salud.helper.validators.ValidationGroups;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User implements Serializable {

    @BsonProperty("tipoDocumento")
    @Schema(example = "CC")
    @NotBlank(message = "El campo documentType no puede ser nulo o vacío")
    @Null(message = "No debe ingresar el campo tipo de documento", groups = ValidationGroups.Post_Get.class)
    private String documentType;

    @BsonProperty("numeroDocumento")
    @Schema(example = "1023456789")
    @Size(min = 7, max = 20, message = "El campo documentNumber debe contener entre 7 y 20 caracteres")
    @NotBlank(message = "El campo documentNumber no puede ser nulo o vacío")
    @Null(message = "No debe ingresar el campo número de documento", groups = ValidationGroups.Post_Get.class)
    private String documentNumber;

    @BsonProperty("nombre")
    @Schema(example = "Julian Andres")
    @NotBlank(message = "El campo name no puede ser nulo o vacío")
    @Size(min = 3, max = 40, message = "El campo name debe contener entre 3 y 40 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$", message = "El nombre no debe contener " +
            "valores numéricos, ni caracteres especiales, ni espacios vacíos al inicio o al final")
    @Null(message = "No debe ingresar el nombre para obtener data de usuario", groups = ValidationGroups.Post_Get.class)
    private String name;

    @BsonProperty("apellido")
    @Schema(example = "Gonzalez Rojas")
    @NotBlank(message = "El campo lastName no puede ser nulo o vacío")
    @Size(min = 3, max = 40, message = "El campo lastName debe contener entre 3 y 40 caracteres")
    @Null(message = "No debe ingresar el campo apellido", groups = ValidationGroups.Post_Get.class)
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$", message = "El apellido no debe contener " +
            "valores numéricos, ni caracteres especiales, ni espacios vacíos al inicio o al final")
    private String lastName;

    @BsonProperty("correo")
    @Schema(example = "usuario@correo.edu.co")
    @Email(message = "El formato del correo ingresado es incorrecto, revise por favor", groups = {ValidationGroups
            .Post_Get.class, ValidationGroups.Post.class})
    @NotBlank(message = "El campo email no puede ser nulo o vacío", groups = {ValidationGroups.Post.class,
            ValidationGroups.Put.class})
    private String email;

    @ToString.Exclude
    @Schema(example = "password")
    @Size(min = 8, message = "La contraseña debe tener mínimo 8 caracteres")
    @NotBlank(message = "El campo password no puede ser nulo o vacío", groups = {ValidationGroups.Post_Get.class,
            ValidationGroups.Post.class})
    private String password;

    @BsonProperty("celular")
    @NotBlank(message = "El campo cellPhone no puede ser nulo o vacío")
    @Pattern(regexp = "^(57-3-)\\d{9}", message = "El formato del número de celular del usuario debe ser 57-3-XXXXXXXXX")
    private String cellPhone;

    @BsonProperty("domicilio")
    @Pattern(regexp = "(|[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\\s#-_.,'\"]{8,})", message = "El campo dirección no puede " +
            "contener caracteres especiales (No puede contener @, €, %, {})")
    private String address;

    @BsonProperty("rol")
    @Schema(example = "ADMINISTRADOR")
    @NotBlank(message = "El campo role no debe ser nulo o vació", groups = ValidationGroups.Post.class)
    private String role;

    @BsonProperty("activo")
    @NotNull(message = "El campo active no debe ser nulo", groups = ValidationGroups.Put.class)
    @Null(message = "No debe enviar datos para el campo active", groups = {ValidationGroups.Post.class,
            ValidationGroups.Post_Get.class})
    private Boolean active;

    @Schema(example = "usuario@correo.com")
    @NotBlank(message = "El campo emailOrDoc no puede ser nulo o vacío", groups = ValidationGroups.Post_Get.class)
    private String emailOrDoc;

    private MediaFile mediaFile;
}
