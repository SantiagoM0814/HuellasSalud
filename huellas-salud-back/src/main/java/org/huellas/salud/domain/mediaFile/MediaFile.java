package org.huellas.salud.domain.mediaFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaFile {

    @Schema(example = "41525378")
    @BsonProperty("identificador")
    private String entityId;

    @Schema(example = "USER")
    @BsonProperty("tipoEntidad")
    private String entityType;

    @BsonProperty("NombreArchivo")
    @Schema(example = "avatar.webp")
    private String fileName;

    @BsonProperty("tipoContenido")
    @Schema(example = "image/webp")
    private String contentType;

    @BsonProperty("tipoArchivo")
    @Schema(example = "image")
    private String fileType;

    @BsonProperty("Adjunto")
    @Schema(example = "UklGRvhiAABXRUJQVlA4IOxiAABwXgKdASpMBKMCPu10slQpv7")
    private String attachment;
}
