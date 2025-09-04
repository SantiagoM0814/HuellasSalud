package org.huellas.salud.helper.jwt;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import lombok.Data;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.huellas.salud.domain.user.User;
import org.huellas.salud.helper.exceptions.HSException;
import org.jboss.logging.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.List;

@Data
@ApplicationScoped
public class JwtService {

    private static final Logger LOG = Logger.getLogger(JwtService.class);
    private static final String ISSUER = "http://localhost";

    private PrivateKey privateKey;

    @Inject
    JsonWebToken jsonWebToken;

    public JwtService() {
        try {
            this.privateKey = loadPrivateKey();
        } catch (Exception ex) {
            LOG.errorf(ex, "@JwtService SERV > No se pudo cargar la clave privada para firmar el JWT");
        }
    }

    public String generateToken(User user) {

        Instant now = Instant.now();

        return Jwt.issuer(ISSUER)
                .subject(user.getEmail())
                .claim("name", user.getName())
                .claim("lastName", user.getLastName())
                .claim("active", user.getActive())
                .claim("groups", List.of(user.getRole()))
                .issuedAt(now)
                .expiresAt(now.plus(Duration.ofHours(2)))
                .sign(privateKey);
    }

    private PrivateKey loadPrivateKey() throws HSException, IOException, NoSuchAlgorithmException, InvalidKeySpecException {

        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("privateKey.pem");

        if (inputStream == null) {

            LOG.errorf("@loadPrivateKey SERV > No se encontro el archivo privateKey.pem en resources");

            throw new HSException(Response.Status.NOT_FOUND, "No se encontró el archivo privateKey.pem en resources");
        }

        String privateKeyPem = new String(inputStream.readAllBytes())
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");

        byte[] keyBytes = Base64.getDecoder().decode(privateKeyPem);

        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);

        return KeyFactory.getInstance("RSA").generatePrivate(spec);
    }

    public String getCurrentUserEmail() {
        return jsonWebToken.getSubject();
    }

    public String getCurrentUserName() {
        if (jsonWebToken.getClaim("name") == null) return null;
        return jsonWebToken.getClaim("name") + " " + jsonWebToken.getClaim("lastName");
    }

    public String getCurrentUserRole() {
        if (jsonWebToken == null || jsonWebToken.getGroups() == null) return null;
        return jsonWebToken.getGroups().stream().findFirst().orElse("");
    }
}
