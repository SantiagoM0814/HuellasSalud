package org.huellas.salud.helper.utils;

import io.vertx.core.http.HttpServerRequest;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.inject.Provider;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.huellas.salud.domain.Meta;
import org.huellas.salud.helper.jwt.JwtService;
import org.jboss.logging.Logger;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class Utils {

    private static final Logger LOG = Logger.getLogger(Utils.class);

    @Inject
    JwtService jwtService;

    @Inject
    Provider<HttpServerRequest> httpServerRequestProvider;

    public String capitalizeWords(String input) {

        LOG.infof("@capitalizeWords SERV > Inicia formato capitalize al valor: %s", input);

        return Arrays.stream(input.toLowerCase().split(" "))
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1))
                .collect(Collectors.joining(" "));
    }

    public Meta getMetaToEntity() throws UnknownHostException {

        LOG.info("@getMetaToEntity SERV > Inicia estructura de los metadatos de la entidad");

        return Meta.builder()
                .creationDate(LocalDateTime.now())
                .source(httpServerRequestProvider.get().absoluteURI())
                .ipAddress(InetAddress.getLocalHost().getHostAddress())
                .nameUserCreated(jwtService.getCurrentUserName())
                .emailUserCreated(jwtService.getCurrentUserEmail())
                .roleUserCreated(jwtService.getCurrentUserRole())
                .tokenRaw(getRawTokenWithBearer())
                .build();
    }

    private String getRawTokenWithBearer() {

        return Optional.ofNullable(jwtService.getJsonWebToken())
                .map(JsonWebToken::getRawToken)
                .map(raw -> "Bearer " + raw)
                .orElse(null);
    }
}
