package org.huellas.salud.helper.exceptions;

import lombok.Builder;
import lombok.Data;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Data
@Builder
public class ProblemException {

    @Schema(example = "localhost:8080")
    private String host;

    @Schema(example = "Solicitud inválida")
    private String title;

    @Schema(example = "Error en los recursos suministrados")
    private String detail;

    @Schema(example = "http://localhost:8080/internal/API_PATH")
    private String uri;

}

