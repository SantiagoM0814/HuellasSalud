package org.huellas.salud.domain.announcement;

import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.huellas.salud.domain.mediaFile.MediaFile;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.io.Serializable;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Announcement implements Serializable {

    @BsonProperty("idAnuncio")
    @Schema(example = "7fa321d4-1e23-4b99-9c82-9b6d8bdfa413")
    private String idAnnouncement;

    @BsonProperty("descripcion")
    @Schema(example = "¡Se busca! Nuestra perrita Luna se perdió el martes 8 de octubre en el sector, " +
            "de San Antonio, cerca del parque principal. Es de raza criolla, color blanco con manchas  " +
            "marrones, de tamaño mediano, muy juguetona y amigable, pero puede estar asustada. Llevaba " +
            "un collar rosado con una plaquita que tiene su nombre.")
    @NotBlank(message = "El campo descripcion no puede ser nulo o vacio")
    @Size(min = 10, max = 500, message = "El campo descripcion debe contener entre 10 y 500 caracteres")
    private String description;

    @BsonProperty("celular")
    @NotBlank(message = "El campo cellPhone no puede ser nulo o vacío")
    @Pattern(regexp = "^(57-3-)\\d{9}", message = "El formato del número de celular del usuario debe ser 57-3-XXXXXXXXX")
    private String cellPhone;

    @BsonProperty("estado")
    private Boolean status;

    @BsonProperty("fechaActivacion")
    private LocalDateTime activatedAt;

    private MediaFile mediaFile;
}