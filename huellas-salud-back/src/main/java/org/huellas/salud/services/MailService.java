package org.huellas.salud.services;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.huellas.salud.domain.mail.ContextEmailConfirm;
import org.huellas.salud.domain.mail.EmailConfirmation;
import org.huellas.salud.domain.mail.EmailDelivery;
import org.huellas.salud.domain.mail.PasswordRecoveryEmail;
import org.huellas.salud.domain.user.User;
import org.huellas.salud.domain.user.UserMsg;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.templates.PasswordRecoveryTemplate;
import org.huellas.salud.repositories.EmailConfirmationRepository;
import org.huellas.salud.repositories.EmailDeliveryRepository;
import org.huellas.salud.repositories.PasswordRecoveryRepository;
import org.huellas.salud.repositories.UserRepository;
import org.jboss.logging.Logger;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class MailService {

    private static final Logger LOG = Logger.getLogger(MailService.class);

    @ConfigProperty(name = "PARAMETER.HUELLAS_SALUD.DOMAIN_RESEND")
    String domainResend;

    @ConfigProperty(name = "PARAMETER.HUELLAS_SALUD.RESEND_API.API_KEY")
    String resendApiKey;

    @Inject
    UserService userService;

    @Inject
    UserRepository userRepository;

    @Inject
    EmailDeliveryRepository emailDeliveryRepository;

    @Inject
    PasswordRecoveryRepository passwordRecoveryRepository;

    @Inject
    EmailConfirmationRepository emailConfirmationRepository;

    public void sendEmailRecoveryPass(String userEmail) throws HSException {

        LOG.infof("@sendEmailRecoveryPass SERV > Inicia el servicio para enviar el correo de recuperacion de " +
                "contrasena al usuario con email: %s. Inicia busqueda del registro del usuario", userEmail);

        UserMsg userMsg = getUserByEmail(userEmail);

        LOG.infof("@sendEmailRecoveryPass SERV > El usuario obtenido fue: %s. Inicia envio de correo", userMsg);

        String subject = "Recuperación de contraseña - Huellas & Salud";
        String type = "RECUPERACION_CONTRASEÑA";
        String resetLink = getResetLink(userMsg);
        String userName = userMsg.getData().getName() + " " + userMsg.getData().getLastName();
        String html = PasswordRecoveryTemplate.formatPasswordRecovery(userName, resetLink);
        String text = PasswordRecoveryTemplate.getTextContentPassRecovery(userName, resetLink);

        CreateEmailOptions options = buildCreateEmailOptions(userEmail, html, text, subject);

        sendEmail(options, subject, type);

        LOG.info("@sendEmailRecoveryPass SERV > Finaliza servicio de envio de correo de recupracion de contrasena");
    }

    public boolean validateTokenRecovery(String approvalCode) throws HSException {

        LOG.info("@validateTokenRecovery SERV > Inicia servicio de validacion del codigo de recuperacion");

        PasswordRecoveryEmail recovery = getPasswordRecovery(approvalCode);

        LOG.infof("@validateTokenRecovery SERV > Se encontro el siguiente registro: %s", recovery);

        boolean isValid = recovery.getValidityDate().isAfter(LocalDateTime.now()) && !recovery.isRecovered();

        isCodeValid(isValid, approvalCode);

        return true;
    }

    private void isCodeValid(boolean isValid, String approvalCode) throws HSException {

        LOG.infof("@isCodeValid SERV > Inicia validacion del codigo de aprobacion. Es valido? %s", isValid);

        if (!isValid) {

            LOG.errorf("@isCodeValid SERV > El codigo de aprobacion: %s es invalido, ya ha sido utilizado " +
                    "o ha expirado", approvalCode);

            throw new HSException(Response.Status.NOT_FOUND, "El enlace de verificación no es válido o ya fue " +
                    "utilizado. Por seguridad, los enlaces de verificación solo pueden usarse una vez y tienen " +
                    "un tiempo limitado de validez. Por favor, solicita uno nuevo");
        }
        LOG.infof("@isCodeValid SERV > El codigo de aprobacion: %s es valido", approvalCode);
    }

    private UserMsg getUserByEmail(String userEmail) throws HSException {

        return userRepository.findUserDataByEmail(userEmail).orElseThrow(() -> {

            LOG.errorf("@getUserByEmail SERV > El usuario con correo: %s no esta registrado", userEmail);

            return new HSException(Response.Status.NOT_FOUND, "El usuario con correo: " + userEmail +
                    " No se encuentra registrado en la base de datos");
        });
    }

    private void sendEmail(CreateEmailOptions options, String subject, String type) throws HSException {

        String userEmail = options.getTo().stream().findFirst().orElse("");

        LOG.infof("@sendEmail SERV > Inicia servicio de envio de correo al email: %s", userEmail);

        try {
            Resend resend = new Resend(resendApiKey);
            CreateEmailResponse response = resend.emails().send(options);
            String description = "Correo entregado correctamente. ID: " + response.getId();

            saveEmailDelivery(description, userEmail, "OK", subject, type);

            LOG.infof("@sendEmailRecoveryPass SERV > Correo enviado correctamente. Respuesta: %s", response.getId());

        } catch (Exception ex) {

            LOG.errorf(ex, "@sendEmailRecoveryPass SERV > Error al enviar correo a: %s", userEmail);

            String description = "Error en envío de correo: " + ex.getMessage();
            saveEmailDelivery(description, userEmail, "ERROR", subject, type);

            throw new HSException(Response.Status.INTERNAL_SERVER_ERROR, "Error al enviar correo de recuperación");
        }
    }

    private CreateEmailOptions buildCreateEmailOptions(String userEmail, String html, String text, String subject) {

        return CreateEmailOptions.builder()
                .from(domainResend)
                .to(List.of(userEmail))
                .subject(subject)
                .html(html)
                .text(text)
                .build();
    }

    private void saveEmailDelivery(String description, String userEmail, String status, String subject, String type) {

        LOG.infof("@saveEmailDelivery SERV > Inicia guardado de registro para el envio del email: %s", userEmail);

        EmailDelivery emailDelivery = EmailDelivery.builder()
                .deliveryId(UUID.randomUUID().toString())
                .description(description)
                .recipient(List.of(userEmail))
                .dateOfShipment(LocalDateTime.now())
                .status(status)
                .subject(subject)
                .type(type)
                .build();

        LOG.infof("@saveEmailDelivery SERV > Se almacena el siguiente registro: %s", emailDelivery);

        emailDeliveryRepository.persist(emailDelivery);

        LOG.infof("@saveEmailDelivery SERV > El registro email delivery fue almacenado correctamente");
    }

    private String getResetLink(UserMsg user) {

        LOG.info("@getResetLink SERV > Inicia obtencion del link de recuperacion de contrasena");

        String token = UUID.randomUUID() + "-" + Instant.now().toEpochMilli();
        String resetLink = "http://localhost:5173/reset-password?approvalCode=" + token;

        PasswordRecoveryEmail recoveryEmail = PasswordRecoveryEmail.builder()
                .approvalCode(token)
                .resetLink(resetLink)
                .requestDate(LocalDateTime.now())
                .validityDate(LocalDateTime.now().plusHours(24))
                .dataUser(userService.getUserDto(user, false))
                .build();

        LOG.infof("@getResetLink SERV > Inicia guardado del registro: %s", recoveryEmail);

        passwordRecoveryRepository.persist(recoveryEmail);

        LOG.info("@getResetLink SERV > El registro se almaceno correctamente. Se retorna link de recuperacion");

        return resetLink;
    }

    public PasswordRecoveryEmail getPasswordRecovery(String approvalCode) throws HSException {

        if (approvalCode == null || approvalCode.isBlank()) {
            LOG.warn("@getPasswordRecovery SERV > Se recibió un approvalCode vacío");
            throw new HSException(Response.Status.BAD_REQUEST, "El código de recuperación no puede estar vacío");
        }

        return passwordRecoveryRepository.findByApprovalCode(approvalCode).orElseThrow(() -> {
            LOG.errorf("@getPasswordRecovery SERV > No hay registros con codigo de aprobacion: %s", approvalCode);

            return new HSException(Response.Status.NOT_FOUND, "El código de recuperación de contraseña no existe");
        });
    }

    public void sendConfirmationEmail(User user) throws HSException {

        String userEmail = user.getEmail();

        LOG.infof("@sendConfirmationEmail SERV > Inicia servicio de envio de correo de confirmacion de " +
                "cuenta al cliente con correo: %s", userEmail);

        String approvalLink = getApprovalLink(user);
        String userName = user.getName() + " " + user.getLastName();
        String type = "CONFIRMACION_CORREO";
        String subject = "Confirmación de correo - Huellas & Salud";
        String html = PasswordRecoveryTemplate.formatConfirmEmail(userName, approvalLink);
        String text = PasswordRecoveryTemplate.getTextContentConfirmEmail(userName, approvalLink);

        userEmail = "supersanti0814@gmail.com";

        CreateEmailOptions options = buildCreateEmailOptions(userEmail, html, text, subject);

        sendEmail(options, subject, type);

        LOG.infof("@sendConfirmationEmail SERV > Finaliza servicio de envio de correo de confirmacion de " +
                "cuenta al cliente con correo: %s", userEmail);
    }

    private String getApprovalLink(User user) {

        LOG.info("@getApprovalLink SERV > Inicia obtencion y guardado de codigo de aprobacion para confirmacion de correo");

        String token = UUID.randomUUID() + "-" + Instant.now().toEpochMilli();
        String approvalLink = "http://localhost:8089/internal/confirm-email/" + token;

        EmailConfirmation emailConfirmation = EmailConfirmation.builder()
                .context(ContextEmailConfirm.builder()
                        .approvalCode(token)
                        .validityDate(LocalDateTime.now().plusDays(3))
                        .requestDate(LocalDateTime.now())
                        .confirmationLink(approvalLink)
                        .build())
                .data(user)
                .build();

        LOG.infof("@getApprovalLink SERV > Inicia guardado en base de datos de la data: %s", emailConfirmation);

        emailConfirmationRepository.persist(emailConfirmation);

        LOG.info("@getApprovalLink SERV > El registro se almaceno correctamente se retorna link de aprobacion");

        return approvalLink;
    }

    public String confirmUserEmail(String approvalCode) throws HSException {

        LOG.info("@confirmUserEmail SERV > Inicia servicio de validacion del codigo de aprobacion");

        EmailConfirmation emailConfirmation = getEmailConfirmation(approvalCode);

        LOG.infof("@confirmUserEmail SERV > Se obtuvo el siguiente registro: %s", emailConfirmation);

        boolean isValid = emailConfirmation.getContext().getValidityDate().isAfter(LocalDateTime.now())
                && !emailConfirmation.getContext().isConfirmed();

        isCodeValid(isValid, approvalCode);

        LOG.info("@confirmUserEmail SERV > Inicia actualizacion de confirmacion");

        updateEmailConfirmation(emailConfirmation);

        LOG.info("@confirmUserEmail SERV > Inicia actualizacion del estado del usuario");

        updateUserStatus(emailConfirmation);

        LOG.info("@confirmUserEmail SERV > El estado del usuario fue activado correctamente");

        return emailConfirmation.getData().getName() + " " + emailConfirmation.getData().getLastName();
    }

    private EmailConfirmation getEmailConfirmation(String approvalCode) throws HSException {

        return emailConfirmationRepository.getEmailConfirmByCode(approvalCode).orElseThrow(() -> {

            LOG.error("@getEmailConfirmation SERV > No se encontro registro de confirmacion de email de usuario");

            return new HSException(Response.Status.NOT_FOUND, "No se encontró registro de confirmación de correo electrónico");
        });
    }

    private void updateUserStatus(EmailConfirmation emailConfirmation) throws HSException {

        User user = emailConfirmation.getData();
        UserMsg userMsg = userService.getUserByDocumentNumber(user.getDocumentNumber(), user.getEmail());

        userMsg.getData().setActive(true);
        userMsg.getMeta().setLastUpdate(LocalDateTime.now());

        LOG.infof("@updateUserStatus SERV > Se actualiza usuario con la data: %s", userMsg);

        userRepository.update(userMsg);
    }

    private void updateEmailConfirmation(EmailConfirmation emailConfirmation) {

        emailConfirmation.getData().setActive(true);
        emailConfirmation.getContext().setConfirmed(true);
        emailConfirmation.getContext().setConfirmationDate(LocalDateTime.now());

        LOG.infof("@updateEmailConfirmation SERV > Se actualiza registro con la data: %s", emailConfirmation);

        emailConfirmationRepository.update(emailConfirmation);
    }
}
