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
import org.huellas.salud.domain.announcement.AnnouncementMsg;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.validators.ValidationGroups;
import org.huellas.salud.services.AnnouncementService;
import org.jboss.logging.Logger;

import java.net.UnknownHostException;
import java.util.List;

@Path("/internal/announcement")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AnnouncementApi {

    private static final Logger LOG = Logger.getLogger(AnnouncementApi.class);

    @Inject
    AnnouncementService announcementService;

    @GET
    @Path("/list-announcements")
    @RolesAllowed({"ADMINISTRADOR", "CLIENTE", "VETERINARIO"})
    @Tag(name = "Gestión de anuncios")
    @APIResponses(
            value = {
                @APIResponse(
                        responseCode = "200",
                        description = "Se retorna el listado de los anuncios registrados correctamente",
                        content = @Content(schema = @Schema(implementation = AnnouncementMsg.class, type = SchemaType.ARRAY))
                )
            }
    )
    @Operation(
            summary = "Obtención de todos los anuncios registrados",
            description = "Permite obtener un listado con la informacion de los anuncios registrados en la base de datos"
    )
    public Response getListAnnounments() {

        LOG.infof("@getListAnnounments API > Inicia servicio para obtener listado de todos los anuncios registrados en mongo");

        List<AnnouncementMsg> announcements = announcementService.getListAnnouncementMsg();

        LOG.infof("@getListAnnounments API > Finaliza servicio para obtener listado de todos los anuncios "
                + "registrados. Se encontraron: %s registros", announcements.size());

        return Response.ok().entity(announcements).build();
    }

    @POST
    @Path("/create")
    @RolesAllowed({"ADMINISTRADOR", "CLIENTE", "VETERINARIO"})
    @Tag(name = "Gestión de anuncios")
    @Operation(
            summary = "Creación de un anuncio nuevo",
            description = "Permite crear el registro de un anuncio nuevo en la base de datos con la información suministrada"
    )
    public Response createAnnouncementData(
            @RequestBody(
                    name = "announcementMsg",
                    description = "Objeto con la información del anuncio que se va a crear",
                    required = true,
                    content = @Content(example = """
                        {
                                "data": {
                                        "description": "¡Se busca! Nuestra perrita Luna se perdió el martes 8 de octubre en el sector, de San Antonio, cerca del parque principal. Es de raza criolla, color blanco con manchas  marrones, de tamaño mediano, muy juguetona y amigable, pero puede estar asustada. Llevaba un collar rosado con una plaquita que tiene su nombre.",
                                        "cellPhone": "57-3-146786711"
                                }
                        }"""
                    )
            )
            @NotNull(message = "Debe ingresar el objeto data con la información del anuncio a registrar")
            @Valid @ConvertGroup(to = ValidationGroups.Post.class) AnnouncementMsg announcementMsg
    ) throws UnknownHostException, HSException {

        LOG.debugf("@createAnnouncementData API > Inicia ejecucion del servicio para crear el registro de un anuncio "
                + "en base de datos con la data: %s", announcementMsg.getData());

        AnnouncementMsg announcementCreated = announcementService.saveAnnouncementDataMongo(announcementMsg);

        LOG.debugf("@createAnnouncementData API > Finaliza ejecucion del servicio para crear el registro de un anuncio "
                + "en base de datos. Se registro la siguiente informacion: %s", announcementMsg);

        return Response.ok()
                .status(Response.Status.CREATED)
                .entity(announcementCreated)
                .build();
    }

    @PUT
    @Path("/update")
    @RolesAllowed("ADMINISTRADOR")
    @Tag(name = "Gestión de anuncios")
    @Operation(
            summary = "Actualización de la información de un anuncio",
            description = "Permite actualizar la información de un anuncio registrado en la base de datos"
    )
    public Response updateAnnouncementData(
            @RequestBody(
                    name = "announcementMsg",
                    description = "Información con la que se actualizará el anuncio",
                    required = true,
                    content = @Content(example = """
                        {
                                "data": {
                                        "idAnnouncement": "e47a974a-5ff7-41f9-bdc9-7505399b6cae",
                                        "description": "¡Se busca! Nuestra perrita Luna se perdió el martes 8 de octubre en el sector, de San Antonio, cerca del parque principal. Es de raza criolla, color blanco con manchas  marrones, de tamaño mediano, muy juguetona y amigable, pero puede estar asustada. Llevaba un collar rosado con una plaquita que tiene su nombre.",
                                        "cellPhone": "57-3-146786711",
                                        "status": true
                                }
                        }"""
                    )
            )
            @NotNull(message = "Debe ingresar los datos del anuncio a actualizar")
            @ConvertGroup(to = ValidationGroups.Put.class) @Valid AnnouncementMsg announcementMsg
    ) throws HSException {

        LOG.infof("@updateAnnouncementData API > Inicia ejecucion del servicio para actualizar el registro de un anuncio "
                + "en base de datos con la data: %s", announcementMsg);

        announcementService.updateAnnouncementDataMongo(announcementMsg);
        AnnouncementMsg announcementUpdated = announcementService.getAnnouncementById(announcementMsg.getData().getIdAnnouncement());

        LOG.debugf("@updateAnnouncementData API > Finaliza ejecucion del servicio para actualizar el registro de un anuncio "
                + "en base de datos con la informacion: %s", announcementMsg);

        return Response.ok(announcementUpdated)
                .build();
    }

    @DELETE
    @Path("/delete")
    @RolesAllowed("ADMINISTRADOR")
    @Tag(name = "Gestión de anuncios")
    @Operation(
            summary = "Eliminación de un anuncio",
            description = "Permite eliminar el registro de un anuncio en la base de datos"
    )
    public Response deleteAnnouncementData(
            @Parameter(
                    name = "idAnnouncement",
                    description = "Identificador del anuncio a eliminar",
                    required = true,
                    example = "26ec4a57-f43b-4230-a169-b0ef1fd6ade1"
            )
            @NotBlank(message = "Debe ingresar el identificador (idAnnouncement) del anuncio a eliminar")
            @QueryParam("idAnnouncement") String idAnnouncement
    ) throws HSException {

        LOG.infof("@deleteAnnouncementData API > Inicia ejecucion del servicio para eliminar el registro de un anuncio "
                + "en base de datos con id: %s", idAnnouncement);

        announcementService.deleteAnnouncementDataMongo(idAnnouncement);

        LOG.infof("@deleteAnnouncementData API > Finaliza ejecucion del servicio para eliminar el registro de un anuncio "
                + "en base de datos con id: %s", idAnnouncement);

        return Response.status(Response.Status.NO_CONTENT).build();
    }

}
