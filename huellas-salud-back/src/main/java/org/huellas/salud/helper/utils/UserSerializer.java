package org.huellas.salud.helper.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.huellas.salud.domain.user.User;

import java.io.IOException;
import java.util.Objects;

public class UserSerializer extends JsonSerializer<User> {

    @Override
    public void serialize(User user, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {

        jsonGenerator.writeStartObject();

        jsonGenerator.writeStringField("documentType", user.getDocumentType());
        jsonGenerator.writeStringField("documentNumber", user.getDocumentNumber());
        jsonGenerator.writeStringField("name", user.getName());
        jsonGenerator.writeStringField("lastName", user.getLastName());
        jsonGenerator.writeStringField("email", user.getEmail());
        jsonGenerator.writeStringField("cellPhone", user.getCellPhone());
        jsonGenerator.writeStringField("address", user.getAddress());
        jsonGenerator.writeStringField("role", user.getRole());
        jsonGenerator.writeBooleanField("active", Objects.requireNonNullElse(user.getActive(), false));
        jsonGenerator.writeObjectField("mediaFile", user.getMediaFile());

        jsonGenerator.writeEndObject();
    }
}
