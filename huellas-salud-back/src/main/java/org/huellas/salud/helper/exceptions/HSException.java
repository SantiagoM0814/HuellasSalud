package org.huellas.salud.helper.exceptions;

import jakarta.ws.rs.core.Response;
import lombok.Getter;

@Getter
public class HSException extends Exception {

    private final Response.Status status;

    public HSException(Response.Status status, String message) {
        super(message);
        this.status = status;
    }
}
