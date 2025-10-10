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
            description = "Permite crear el registro de un servicio nuevo en la base de datos con la información dada"
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
}
