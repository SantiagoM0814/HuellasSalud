package org.huellas.salud.rest;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.huellas.salud.domain.appointment.AppointmentMsg;
import org.huellas.salud.services.AppointmentService;
import org.huellas.salud.helper.exceptions.HSException;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import jakarta.ws.rs.core.MediaType;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;
import jakarta.ws.rs.*;
import org.huellas.salud.helper.validators.ValidationGroups;
import jakarta.validation.groups.ConvertGroup;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;

import java.net.UnknownHostException;
import java.util.List;

@Path("/internal/appointment")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AppointmentApi {

    private static final Logger LOG = Logger.getLogger(AppointmentApi.class);

    @Inject
    AppointmentService appointmentService;

    @GET
    @Path("/list-appointments")
    @Tag(name = "Gestión de citas")
    @APIResponses(
            value = {
                    @APIResponse(
                            responseCode = "200",
                            description = "Se retorna el listado de las citas registradas correctamente",
                            content = @Content(schema = @Schema(implementation = AppointmentMsg.class, type = SchemaType.ARRAY))
                    )
            }
    )
    @Operation(
            summary = "Obtención de todas las citas registradas",
            description = "Permite obtener un listado con la información de las citas registradas en la base de datos"
    )
    public Response getListAppointments(){

        LOG.infof("@getListAppointments API > Inicia servicio para obtener listado de todas las citas registradas en mongo");

        List<AppointmentMsg> appointments = appointmentService.getListAppointmentMsg();

        LOG.infof("@getListAppointments API > Finaliza servicio para obtener el listado de todas las citas "
            + "registadas. Se encontraron: %s registros", appointments.size());

        return Response.ok().entity(appointments).build();
    }

    @POST
    @Path("/create")
    @Tag(name = "Gestión de citas")
    @Operation(
            summary = "Creación de una cita nueva",
            description = "Permite crear el registro de una cita nueva en la base de datos con la informacion suministrada"
    )
    public Response createAppointmentData(
            @RequestBody(
                    name = "appointmentMsg",
                    description = "Objeto con la información de la cita que se va a crear",
                    required = true
            )
            @NotNull(message = "Debe ingresar el objeto data con la informacion de la cita a registrar")
            @Valid @ConvertGroup(to = ValidationGroups.Post.class) AppointmentMsg appointmentMsg
    ) throws UnknownHostException, HSException {

        LOG.infof("@createAppointmentData API > Inicia ejecucion del servicio para crear el registro de una cita "
            + "en base de datos con la data: %s", appointmentMsg.getData());

        AppointmentMsg appointmentCreated = appointmentService.saveAppointmentDataMongo(appointmentMsg);

        LOG.infof("@createAppointmentData API > Finaliza ejecucion del servicio para crear el registro de una cita "
            + "en base de datos. Se registro la siguiente informacion: %s", appointmentMsg);

        return Response.ok()
                .status(Response.Status.CREATED)
                .entity(appointmentCreated)
                .build();
    }
}