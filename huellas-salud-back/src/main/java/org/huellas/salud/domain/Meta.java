package org.huellas.salud.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Meta implements Serializable {

    @BsonProperty("fechaCreacion")
    private LocalDateTime creationDate;

    @BsonProperty("ultimaActualizacion")
    private LocalDateTime lastUpdate;

    @Schema(example = "192.168.1.1")
    private String ipAddress;

    @Schema(example = "http://localhost:8089/internal/API_PATH")
    private String source;

    @BsonProperty("nombreUsuarioCreo")
    @Schema(example = "Juan Esteban Martinez Lopez")
    private String nameUserCreated;

    @BsonProperty("correoUsuarioCreo")
    @Schema(example = "usuario@correo.com")
    private String emailUserCreated;

    @BsonProperty("rolUsuarioCreo")
    @Schema(example = "ADMINISTRADOR")
    private String roleUserCreated;

    @BsonProperty("nombreUsuarioActualizo")
    @Schema(example = "John Alexander Suarez Mendez")
    private String nameUserUpdated;

    @BsonProperty("correoUsuarioActualizo")
    @Schema(example = "usuario@correo.com")
    private String emailUserUpdated;

    @BsonProperty("rolUsuarioActualizo")
    @Schema(example = "ADMINISTRADOR")
    private String roleUserUpdated;

    @Schema(example = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImpZCI6Ii1L")
    private String tokenRaw;
}
