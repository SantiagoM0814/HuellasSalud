package org.huellas.salud.helper.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.huellas.salud.domain.mediaFile.MediaFile;

import java.io.IOException;

public class MediaFileSerializer extends JsonSerializer<MediaFile> {

    @Override
    public void serialize(MediaFile mediaFile, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {

        jsonGenerator.writeStartObject();

        jsonGenerator.writeStringField("entityId", mediaFile.getEntityId());
        jsonGenerator.writeStringField("entityType", mediaFile.getEntityType());
        jsonGenerator.writeStringField("fileName", mediaFile.getFileName());
        jsonGenerator.writeStringField("contentType", mediaFile.getContentType());
        jsonGenerator.writeStringField("fileType", mediaFile.getFileType());
        jsonGenerator.writeStringField("attachment", "iVBORw0KGgoAAAANSUhEUgAAAg0AAANnCAYAAACyAGscAAAA");

        jsonGenerator.writeEndObject();
    }
}
