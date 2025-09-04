package org.huellas.salud.rest;

import jakarta.inject.Inject;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.templates.ConfirmEmailTemplate;
import org.huellas.salud.services.MailService;
import org.jboss.logging.Logger;

@Path("/internal")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MailApi {

    private static final Logger LOG = Logger.getLogger(MailApi.class);

    @Inject
    MailService mailService;

    @GET
    @Tag(name = "Gestión correo")
    @Path("/password-recovery/{userEmail}")
    @Operation(
            summary = "Enviar correo electrónico",
            description = "Permite enviar el correo electrónico de recuperación de contraseña"
    )
    public Response sendEmailRecovery(
            @Parameter(
                    name = "userEmail",
                    description = "Correo electrónico dle usuario",
                    example = "usuario@correo.com",
                    required = true
            )
            @NotBlank(message = "El valor del email no puede ser nulo o vacío")
            @PathParam("userEmail") String userEmail
    ) throws HSException {

        LOG.infof("@sendEmailRecovery API > Inicia recuperacion de contrasena del usuario con correo: %s", userEmail);

        mailService.sendEmailRecoveryPass(userEmail);

        LOG.infof("@sendEmailRecovery API > Finaliza recuperacion de contrasena del usuario con correo: %s", userEmail);

        return Response.ok().status(Response.Status.NO_CONTENT).build();
    }

    @PUT
    @Tag(name = "Gestión correo")
    @Path("/validate-token/{approvalCode}")
    @Operation(
            summary = "Validar código de aprobación de recuperación",
            description = "Permite validar código de aprobación de recuperación de contraseña"
    )
    public Response validateTokenRecovery(
            @Parameter(
                    name = "approvalCode",
                    description = "Código de aprobación generado para recuperar contraseña",
                    example = "a12501a8-3f2d-4b31-807a-285ea4be8982-1753239660434",
                    required = true
            )
            @NotBlank(message = "El código de aprobación no puede ser nulo o vacío")
            @PathParam("approvalCode") String approvalCode
    ) throws HSException {

        LOG.infof("@validateTokenRecovery API > Inicia validacion del codigo de aprobacion: %s", approvalCode);

        boolean isValid = mailService.validateTokenRecovery(approvalCode);

        LOG.infof("@validateTokenRecovery API > Finaliza validacion del codigo de aprobacion: %s. El " +
                "codigo es valido ? %s", approvalCode, isValid);

        return Response.ok().entity(isValid).build();
    }

    @GET
    @Tag(name = "Gestión correo")
    @Path("/confirm-email/{approvalCode}")
    @Operation(
            summary = "Validar código de aprobación de confirmación de correo",
            description = "Permite validar el código de aprobación y confirmar el correo del usuario nuevo"
    )
    public Response validateTokenConfirmationEmail(
            @Parameter(
                    name = "approvalCode",
                    description = "Código de aprobación generado para confirmación de correo",
                    example = "a12501a8-3f2d-4b31-807a-285ea4be8982-1753239660434",
                    required = true
            )
            @NotBlank(message = "El código de aprobación no puede ser nulo o vacío")
            @PathParam("approvalCode") String approvalCode
    ) {
        try {

            LOG.infof("@validateTokenConfirmationEmail API > Inicia servicio validacion de codigo: %s", approvalCode);

            String userName = mailService.confirmUserEmail(approvalCode);

            LOG.info("@validateTokenConfirmationEmail API > Finaliza validacion y confirmacion del correo de usuario.");

            return Response.ok()
                    .type(MediaType.TEXT_HTML)
                    .entity(ConfirmEmailTemplate.formatSuccessTemplate(userName))
                    .build();

        } catch (HSException ex) {

            LOG.errorf(ex, "@validateTokenConfirmationEmail API > Error al validar codigo: %s", approvalCode);

            return Response.ok()
                    .type(MediaType.TEXT_HTML)
                    .entity(ConfirmEmailTemplate.formatErrorTemplate(ex.getMessage()))
                    .build();

        } catch (Exception ex) {

            LOG.errorf(ex, "@validateTokenConfirmationEmail API > Error inesperado al validar codigo " +
                    "de aprobacion: %s", approvalCode);

            String message = "Ocurrió un error inesperado. Por favor intenta más tarde.";

            return Response.ok()
                    .type(MediaType.TEXT_HTML)
                    .entity(ConfirmEmailTemplate.formatErrorTemplate(message))
                    .build();
        }
    }

}
