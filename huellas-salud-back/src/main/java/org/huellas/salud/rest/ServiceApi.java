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
import org.huellas.salud.domain.service.ServiceMsg;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.validators.ValidationGroups;
import org.huellas.salud.services.ServiceService;
import org.jboss.logging.Logger;

import java.net.UnknownHostException;
import java.util.List;

@Path("/internal/service")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ServiceApi {

    private static final Logger LOG = Logger.getLogger(ServiceApi.class);

    @Inject
    ServiceService serviceService;

    @GET
    @Path("/list-services")
    @Tag(name = "Gestión de servicios")
    @APIResponses(
            value = {
                @APIResponse(
                        responseCode = "200",
                        description = "Se retorna el listado de los servicios registrados correctamente",
                        content = @Content(schema = @Schema(implementation = ServiceMsg.class, type = SchemaType.ARRAY))
                )
            }
    )
    @Operation(
            summary = "Obtención de todos los servicios registrados",
            description = "Permite obtener un listado con la informacion de los servicios registrados en la base de datos"
    )
    public Response getListServices() {

        LOG.infof("@getListServices API > Inicia servicio para obtener listado de todos los servicios registrados en mongo");

        List<ServiceMsg> services = serviceService.getListServiceMsg();

        LOG.infof("@getListServices API > Finaliza servicio para obtener listado de todos los servicios "
                + "registrados. Se encontraron: %s registros", services.size());

        return Response.ok().entity(services).build();
    }

    @POST
    @Path("/create")
    @Tag(name = "Gestión de servicios")
    @Operation(
            summary = "Creación de un servicio nuevo",
            description = "Permite crear el registro de un servicio nuevo en la base de datos con la información suministrada"
    )
    public Response createServiceData(
            @RequestBody(
                    name = "serviceMsg",
                    description = "Objeto con la información del servicio que se va a crear",
                    required = true
            )
            @NotNull(message = "Debe ingresar el objeto data con la información del servicio a registrar")
            @Valid @ConvertGroup(to = ValidationGroups.Post.class) ServiceMsg serviceMsg
    ) throws UnknownHostException, HSException {

        LOG.debugf("@createServiceData API > Inicia ejecucion del servicio para crear el registro de un servicio "
                + "en base de datos con la data: %s", serviceMsg.getData());

        ServiceMsg serviceCreated = serviceService.saveServiceDataMongo(serviceMsg);

        LOG.debugf("@createServiceData API > Finaliza ejecucion del servicio para crear el registro de un servicio "
                + "en base de datos. Se registro la siguiente informacion: %s", serviceMsg);

        return Response.ok()
                .status(Response.Status.CREATED)
                .entity(serviceCreated)
                .build();
    }

    @PUT
    @Path("/update")
    @Tag(name = "Gestión de servicios")
    @Operation(
            summary = "Actualización de la información de un servicio",
            description = "Permite actualizar la información de un servicio registrado en la base de datos"
    )
    public Response updateServiceData(
            @RequestBody(
                    name = "serviceMsg",
                    description = "Información con la que se actualizará el servicio",
                    required = true
            )
            @NotNull(message = "Debe ingresar los datos del servicio a actualizar")
            @ConvertGroup(to = ValidationGroups.Put.class) @Valid ServiceMsg serviceMsg
    ) throws HSException {

        LOG.infof("@updateServiceData API > Inicia ejecucion del servicio para actualizar el registro de un servicio "
                + "en base de datos con la data: %s", serviceMsg);

        serviceService.updateServiceDataMongo(serviceMsg);
        ServiceMsg serviceUpdated = serviceService.getServiceById(serviceMsg.getData().getIdService());

        LOG.debugf("@updateServiceData API > Finaliza ejecucion del servicio para actualizar el registro de un servicio "
                + "en base de datos con la informacion: %s", serviceMsg);

        return Response.ok(serviceUpdated)
                .build();
    }

    @DELETE
    @Path("/delete")
    @Tag(name = "Gestión de servicios")
    @Operation(
            summary = "Eliminación de un servicio",
            description = "Permite eliminar el registro de un servicio en la base de datos"
    )
    public Response deleteServiceData(
            @Parameter(
                    name = "idService",
                    description = "Identificador del servicio a eliminar",
                    required = true,
                    example = "26ec4a57-f43b-4230-a169-b0ef1fd6ade1"
            )
            @NotBlank(message = "Debe ingresar el identificador (idService) del servicio a eliminar")
            @QueryParam("idService") String idService
    ) throws HSException {

        LOG.infof("@deleteServiceData API > Inicia ejecucion del servicio para eliminar el registro de un servicio "
                + "en base de datos con id: %s", idService);

        serviceService.deleteServiceDataMongo(idService);

        LOG.infof("@deleteServiceData API > Finaliza ejecucion del servicio para eliminar el registro de un servicio "
                + "en base de datos con id: %s", idService);

        return Response.status(Response.Status.NO_CONTENT).build();
    }

}
