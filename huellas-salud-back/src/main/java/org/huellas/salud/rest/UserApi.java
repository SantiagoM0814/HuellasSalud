package org.huellas.salud.rest;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.groups.ConvertGroup;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.ExampleObject;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.huellas.salud.domain.mail.PasswordRecovery;
import org.huellas.salud.domain.user.UserMsg;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.validators.ValidationGroups;
import org.huellas.salud.services.UserService;
import org.jboss.logging.Logger;

import java.net.UnknownHostException;
import java.util.List;

@Path("/internal/user")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserApi {

    private static final Logger LOG = Logger.getLogger(UserApi.class);

    @Inject
    UserService userService;

    @POST
    @Path("/login")
    @Tag(name = "Gestión de usuarios")
    @Operation(
            summary = "Obtención de un usuario registrado",
            description = "Permite obtener la información de un usuario por los datos proporcionados"
    )
    public Response getOneUserData(
            @RequestBody(
                    name = "userMsg",
                    description = "Información del usuario que se va a consultar",
                    content = @Content(examples = {
                            @ExampleObject(
                                    name = "Enviar correo electrónico",
                                    value = """
                                            {
                                                "data": {
                                                    "emailOrDoc": "emailusuario@correo.com",
                                                    "password": "password"
                                                }
                                            }"""
                            ),
                            @ExampleObject(
                                    name = "Enviar número de documento",
                                    value = """
                                            {
                                                "data": {
                                                    "emailOrDoc": "1015624875",
                                                    "password": "password"
                                                }
                                            }"""
                            )
                    })
            )
            @NotNull(message = "Debe ingresar el objeto con la información del usuario a registrar")
            @Valid @ConvertGroup(to = ValidationGroups.Post_Get.class) UserMsg userMsg
    ) throws HSException {

        LOG.infof("@getOneUserData API > Inicia ejecucion del servicio para obtener registro del usuario con " +
                "el correo o numero de documento: %s en la base de datos", userMsg.getData().getEmailOrDoc());

        UserMsg userMongo = userService.getRegisteredUserInMongo(userMsg);

        LOG.infof("@getOneUserData API > Finaliza servicio para obtener registro del usuario con el correo o " +
                "numero de documento: %s. La data se obtuvo correctamente", userMsg.getData().getEmailOrDoc());

        return Response.ok().entity(userMongo).build();
    }

    @GET
    @Path("/list-users")
    @RolesAllowed("ADMINISTRADOR")
    @Tag(name = "Gestión de usuarios")
    @APIResponses(
            value = {
                    @APIResponse(
                            responseCode = "200",
                            description = "Se retorna el listado de usuarios registrados correctamente",
                            content = @Content(schema = @Schema(implementation = UserMsg.class, type = SchemaType.ARRAY))
                    )
            }
    )
    @Operation(
            summary = "Obtención de todos los usuarios registrados",
            description = "Permite obtener un listado con la información de los usuario registrados en la base de datos"
    )
    public Response getListUsers() {

        LOG.info("@getListUsers API > Inicia servicio para obtener listado de todos los usuarios registrados en mongo");

        List<UserMsg> users = userService.getListRegisteredUser();

        LOG.infof("@getListUsers API > Finaliza servicio para obtener listado de todos los usuarios " +
                "registrados. Se encontraron: %s registros", users.size());

        return Response.ok().entity(users).build();
    }

    @POST
    @Path("/register")
    @Tag(name = "Gestión de usuarios")
    @Operation(
            summary = "Creación de un usuario nuevo",
            description = "Permite crear el registro de un usuario nuevo en la base de datos con la información dad"
    )
    public Response createUserData(
            @RequestBody(
                    name = "userMsg",
                    description = "Objeto con la información del usuario que se va a crear",
                    required = true,
                    content = @Content(example = """
                            {
                                "data": {
                                    "name": "John Alexander",
                                    "lastName": "Gonzalez Rojas",
                                    "documentType": "CC",
                                    "documentNumber": "1023456789",
                                    "email": "jhongonzalex@correo.com",
                                    "cellPhone": "57-3-102548799",
                                    "address": "calle falsa # 123",
                                    "password": "password",
                                    "role": "ADMINISTRADOR"
                                }
                            }"""
                    )
            )
            @NotNull(message = "Debe ingresar el objeto data con la información del usuario a registrar")
            @Valid @ConvertGroup(to = ValidationGroups.Post.class) UserMsg userMsg
    ) throws UnknownHostException, HSException {

        LOG.infof("@createUserData API > Inicia servicio de creacion de usuario con la data: %s", userMsg);

        UserMsg userCreated = userService.saveUserDataInMongo(userMsg);

        LOG.info("@createUserData API > Finaliza servicio. El usuario se registro correctamente");

        return Response.ok()
                .status(Response.Status.CREATED)
                .entity(userCreated)
                .build();
    }

    @PUT
    @PermitAll
    @Path("/update")
    @Tag(name = "Gestión de usuarios")
    @Operation(
            summary = "Edición de un usuario registrado",
            description = "Permite modificar la información de un usuario registrado con los datos proporcionados"
    )
    public Response updateUserData(
            @RequestBody(
                    name = "userMsg",
                    description = "Información con la que se actualizara el usuario",
                    required = true,
                    content = @Content(example = """
                            {
                                "data": {
                                    "name": "Juan Pablo",
                                    "lastName": "Gomez",
                                    "documentType": "CC",
                                    "documentNumber": "1034567819",
                                    "password": "password",
                                    "email": "juanpa@correo.com",
                                    "cellPhone": "57-3-102548799",
                                    "address": "calle falsa # 123",
                                    "active": "false"
                                }
                            }""")
            )
            @Valid @ConvertGroup(to = ValidationGroups.Put.class) UserMsg userMsg
    ) throws HSException {

        LOG.infof("@updateUserData API > Inicia ejecucion de servicio de actualizacion de usuario con la data" +
                ": %s en mongo", userMsg.getData());

        userService.updateUserDataInMongo(userMsg);

        LOG.infof("@updateUserData API > Finaliza ejecucion de servicio de actualizacion de usuario. El " +
                "registro se actualizo con la data: %s", userMsg.getData().getDocumentNumber(), userMsg);

        return Response.ok()
                .status(Response.Status.NO_CONTENT)
                .build();
    }

    @PUT
    @Path("/update-password")
    @Tag(name = "Gestión de usuarios")
    @Operation(
            summary = "Actualizar contraseña",
            description = "Permite cambiar la contraseña del usuario por la opción de recuperación de contraseña"
    )
    public Response updatePassword(
            @RequestBody(
                    name = "passwordRecovery",
                    description = "Información del usuario",
                    required = true
            )
            @NotNull(message = "Debe ingresar la información para actualizar la contraseña")
            @Valid PasswordRecovery passwordRecovery
    ) throws HSException {

        LOG.info("@updatePassword API > Inicia servicio de cambio de contrasena del usuario");

        userService.updateUserPassword(passwordRecovery);

        LOG.info("@updatePassword API > Finaliza servicio de cambio de contrasena del usuario");

        return Response.ok()
                .status(Response.Status.NO_CONTENT)
                .build();
    }

    @DELETE
    @Path("/delete")
    @RolesAllowed("ADMINISTRADOR")
    @Tag(name = "Gestión de usuarios")
    @Operation(
            summary = "Eliminación de un usuario registrado",
            description = "Permite eliminar el registro de un usuario registrado por su número de documento y correo"
    )
    public Response deleteUserData(
            @Parameter(
                    name = "documentNumber",
                    description = "Numero de identificación del usuario a eliminar en mongo",
                    example = "12345670",
                    required = true
            )
            @NotBlank(message = "El valor para número de documento no puede ser nulo o vacío")
            @Size(min = 7, max = 20, message = "El campo número de documento debe contener entre 7 y 20 caracteres")
            @QueryParam("documentNumber") String documentNumber,
            @Parameter(
                    name = "emailUser",
                    description = "Correo del usuario a eliminar en mongo",
                    example = "juanperez@correo.com",
                    required = true
            )
            @NotBlank(message = "El valor para el campo email no puede ser nulo o vacío")
            @Email(message = "El valor de campo email contiene un formato no válido, corríjalo por favor")
            @QueryParam("emailUser") String emailUser
    ) throws HSException {

        LOG.infof("@deleteUserData API > Inicia ejecucion del servicio para eliminar el registro del usuario " +
                "con numero de documento: %s y correo: %s en mongo", documentNumber, emailUser);

        userService.deleteUserDataInMongo(documentNumber, emailUser);

        LOG.infof("@deleteUserData API > Finaliza ejecucion del servicio para eliminar el registro del " +
                "usuario con numero de documento: %s y correo: %s en mongo", documentNumber, emailUser);

        return Response.ok()
                .status(Response.Status.NO_CONTENT)
                .build();
    }
}
