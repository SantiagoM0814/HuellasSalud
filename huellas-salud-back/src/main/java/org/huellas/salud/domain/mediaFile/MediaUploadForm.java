package org.huellas.salud.domain.mediaFile;

import jakarta.validation.constraints.NotNull;
import org.jboss.resteasy.reactive.multipart.FileUpload;
import lombok.Data;
import org.jboss.resteasy.reactive.RestForm;

@Data
public class MediaUploadForm {

    @RestForm("file")
    @NotNull(message = "El campo file no puede ser nulo")
    private FileUpload fileUpload;
}
