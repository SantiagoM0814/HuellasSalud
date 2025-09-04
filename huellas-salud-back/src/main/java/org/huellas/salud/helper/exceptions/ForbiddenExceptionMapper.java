package org.huellas.salud.helper.exceptions;

import io.quarkus.security.ForbiddenException;
import io.vertx.core.http.HttpServerRequest;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class ForbiddenExceptionMapper implements ExceptionMapper<ForbiddenException> {

    @Inject
    jakarta.inject.Provider<HttpServerRequest> httpServerRequestProvider;

    @Override
    public Response toResponse(ForbiddenException ex) {

        ProblemException problemException = ProblemException.builder()
                .host(httpServerRequestProvider.get().getHeader("Host"))
                .title(Response.Status.FORBIDDEN.getReasonPhrase())
                .detail("No tienes permisos para realizar esta acción.")
                .uri(httpServerRequestProvider.get().absoluteURI())
                .build();

        return Response.status(Response.Status.FORBIDDEN)
                .type(MediaType.APPLICATION_JSON)
                .entity(problemException)
                .build();
    }
}
