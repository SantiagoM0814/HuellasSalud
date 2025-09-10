package org.huellas.salud.rest;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.huellas.salud.domain.mediaFile.MediaFile;
import org.huellas.salud.domain.mediaFile.MediaUploadForm;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.services.MediaFileService;
import org.jboss.logging.Logger;

@Path("/internal")
@Produces(MediaType.APPLICATION_JSON)
public class MediaFileApi {

    private static final Logger LOG = Logger.getLogger(MediaFileApi.class);

    @Inject
    MediaFileService mediaFileService;

    @GET
    @Path("/avatar-user/{entityType}/{entityId}")
    public Response getMedia(
            @Parameter(
                    name = "entityType",
                    description = "Tipo de entidad, si es para un usuario mascota o producto",
                    example = "User",
                    required = true
            )
            @NotBlank(message = "El valor del entityType (tipoEntidad) no puede ser nulo o vació")
            @PathParam("entityType") String entityType,
            @Parameter(
                    name = "entityId",
                    description = "Identificador de la entidad",
                    example = "1012345678",
                    required = true
            )
            @NotBlank(message = "El valor del entityId (idEntidad) no puede ser nulo o vació")
            @PathParam("entityId") String entityId
    ) throws HSException {

        LOG.infof("@getMedia API > Inicia servicio para obtener la imagen del entity type: %s y " +
                "entity Id: %s", entityType, entityId);

        MediaFile mediaFile = mediaFileService.getMedia(entityType, entityId);

        LOG.infof("@getMedia API > Finaliza servicio para obtener la imagen del entity type: %s y " +
                "entity Id: %s", entityType, entityId);

        return Response.ok()
                .entity(mediaFile.getAttachment())
                .build();
    }

    @POST
    @Transactional
    @Path("/avatar-user/{entityType}/{entityId}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Operation(
            summary = "Almacenar imagen usuario, mascota o producto",
            description = "Permite guardar el avatar o imagen de perfil de un usuario, una mascota o un producto"
    )
    public Response uploadAvatarUser(
            @Parameter(
                    name = "entityType",
                    description = "Tipo de entidad, si es para un usuario mascota o producto",
                    example = "User",
                    required = true
            )
            @NotBlank(message = "El valor del entityType (tipoEntidad) no puede ser nulo o vació")
            @PathParam("entityType") String entityType,
            @Parameter(
                    name = "entityId",
                    description = "Identificador de la entidad",
                    example = "1012345678",
                    required = true
            )
            @NotBlank(message = "El valor del entityId (idEntidad) no puede ser nulo o vació")
            @PathParam("entityId") String entityId,
            @Valid MediaUploadForm mediaUploadForm
    ) throws HSException {

        LOG.infof("@uploadAvatarUser API > Inicia servicio de carga de imagen para entity type: %s y " +
                "entity Id: %s", entityType, entityId);

        MediaFile mediaFile = mediaFileService.saveFile(entityType, entityId, mediaUploadForm);

        LOG.infof("@uploadAvatarUser API > Finaliza servicio de carga de imagen para entity type: %s y " +
                "entity Id: %s", entityType, entityId);

        return Response.ok().status(Response.Status.CREATED)
                .entity(mediaFile)
                .build();
    }

    @PUT
    @Path("/avatar-user/update/{entityType}/{entityId}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Operation(
            summary = "Actualizar imagen de usuario, mascota o producto",
            description = "Permite reemplazar el avatar existente de un usuario, mascota o producto"
    )
    public Response updateAvatarUser(
            @Parameter(
                    name = "entityType",
                    description = "Tipo de entidad, si es para un usuario, mascota o producto",
                    example = "User",
                    required = true
            )
            @NotBlank(message = "El valor del entityType no puede ser nulo o vacío")
            @PathParam("entityType") String entityType,

            @Parameter(
                    name = "entityId",
                    description = "Identificador de la entidad",
                    example = "1012345678",
                    required = true
            )
            @NotBlank(message = "El valor del entityId no puede ser nulo o vacío")
            @PathParam("entityId") String entityId,

            @Valid MediaUploadForm mediaUploadForm
    ) throws HSException {

        LOG.infof("@updateAvatarUser API > Inicia actualización de imagen para entityType: %s y entityId: %s",
                entityType, entityId);

        // Lógica: borrar/reemplazar archivo anterior y guardar nuevo
        mediaFileService.updateMediaFileInMongo(entityType, entityId, mediaUploadForm);

        LOG.infof("@updateAvatarUser API > Finaliza actualización de imagen para entityType: %s y entityId: %s",
                entityType, entityId);

        return Response.ok()
                .status(Response.Status.NO_CONTENT) // o NO_CONTENT si no devuelves nada
                .build();
    }
}
