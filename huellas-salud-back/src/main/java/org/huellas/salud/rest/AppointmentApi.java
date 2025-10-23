package org.huellas.salud.rest;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.huellas.salud.domain.appointment.AppointmentMsg;
import org.huellas.salud.domain.appointment.Appointment;
import org.huellas.salud.services.AppointmentService;
import jakarta.validation.constraints.NotBlank;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
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
import java.util.HashMap;
import java.util.Map;

import java.net.UnknownHostException;
import java.util.List;
import java.time.LocalDate;
import java.util.Collections;


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
    public Response getListAppointments() {

        LOG.infof("@getListAppointments API > Inicia servicio para obtener listado de todas las citas registradas en mongo");

        List<AppointmentMsg> appointments = appointmentService.getListAppointmentMsg();

        LOG.infof("@getListAppointments API > Finaliza servicio para obtener el listado de todas las citas "
                + "registadas. Se encontraron: %s registros", appointments.size());

        return Response.ok().entity(appointments).build();
    }

    @GET
    @Path("/list-appointments-user/{idOwner}")
    @Tag(name = "Gestión de citas")
    @APIResponses(
            value = {
                @APIResponse(
                        responseCode = "200",
                        description = "Se retorna el listado de las citas del usuario correctamente",
                        content = @Content(schema = @Schema(implementation = AppointmentMsg.class, type = SchemaType.ARRAY))
                ),
                @APIResponse(
                        responseCode = "404",
                        description = "No se encontraron citas para el usuario indicado"
                )
            }
    )
    @Operation(
            summary = "Obtención de citas de un usuario",
            description = "Permite obtener el listado de las citas registradas asociadas a un usuario específico según su número de documento"
    )
    public Response getListAppointmentsUser(@PathParam("idOwner") String idOwner) {

        LOG.infof("@getListAppointmentsUser API > Inicia servicio para obtener el listado de citas del usuario con documento: %s", idOwner);

        List<AppointmentMsg> appointments = appointmentService.getListAppointmentsUser(idOwner);

        if (appointments == null || appointments.isEmpty()) {
            LOG.warnf("@getListAppointmentsUser API > No se encontraron citas para el usuario con documento: %s", idOwner);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("No se encontraron citas para el usuario con documento: " + idOwner)
                    .build();
        }

        LOG.infof("@getListAppointmentsUser API > Finaliza servicio. Se encontraron %s citas para el usuario con documento: %s", appointments.size(), idOwner);

        return Response.ok().entity(appointments).build();
    }

    @GET
    @Path("/available")
    @Tag(name = "Gestión de citas")
    @Operation(
            summary = "Obtiene los horarios disponibles para un veterinario en una fecha específica",
            description = "Devuelve una lista de horas disponibles (de 30 minutos) dentro del horario del veterinario, excluyendo su almuerzo y citas ocupadas"
    )
    @APIResponse(
            responseCode = "200",
            description = "Lista de horas disponibles",
            content = @Content(schema = @Schema(implementation = String.class, type = SchemaType.ARRAY))
    )
    public Response getAvailableSlots(
            @QueryParam("idVeterinarian") String idVeterinarian,
            @QueryParam("date") LocalDate date) throws HSException {

        LOG.infof("@getAvailableSlots API > Consultando horarios disponibles del veterinario %s para el día %s",
                idVeterinarian, date);

        List<String> availableSlots = appointmentService.getAvailableSlots(idVeterinarian, date);

        return Response.ok(Collections.singletonMap("availableSlots", availableSlots)).build();
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

        return Response.status(Response.Status.CREATED)
                .entity(appointmentCreated)
                .build();
    }

    @PUT
    @Path("/update")
    @Tag(name = "Gestión de citas")
    @Operation(
            summary = "Actualización de la información de una cita",
            description = "Permite actualizar la información de una cita registrada en la base de datos"
    )
    public Response updateAppointmentData(
            @RequestBody(
                    name = "citaMsg",
                    description = "Información con la que se actualizara la cita",
                    required = true
            )
            @NotNull(message = "Debe ingresar los datos de la cita a actualizar")
            @ConvertGroup(to = ValidationGroups.Put.class) @Valid AppointmentMsg appointmentMsg
    ) throws HSException {

        LOG.infof("@updateAppointmentData API > Inicia ejecucion del servicio para actualiazr el registro de una cita "
                + "en la base de datos con la data: %s", appointmentMsg);

        appointmentService.updateAppointmentDataMongo(appointmentMsg);
        AppointmentMsg appointmentUpdated = appointmentService.getAppointmentById(appointmentMsg.getData().getIdAppointment());

        LOG.debugf("@updateAppointmentData API > Finaliza ejecucion del servicio para actualizar el registro de una cita "
                + "en base de datos con la informacion: %s", appointmentMsg);

        return Response.ok(appointmentUpdated)
                .build();
    }

    @DELETE
    @Path("/delete")
    @Tag(name = "Gestión de citas")
    @Operation(
            summary = "Eliminación de una cita",
            description = "Permite eliminar el registro de una cita en la base de datos"
    )
    public Response deleteAppointmentData(
            @Parameter(
                    name = "idAppointment",
                    description = "Identificador de la cita a eliminar",
                    required = true,
                    example = "faf32d41-65b2-431b-a468-0dbc6650ae47"
            )
            @NotBlank(message = "Debe ingresar el identificador (idAppointment) de la cita a eliminar")
            @QueryParam("idAppointment") String idAppointment
    ) throws HSException {

        LOG.infof("@deleteAppointmentData API > Inicia ejecucion del servicio para eliminar el registro de una cita "
                + "en la base de datos con id: %s", idAppointment);

        appointmentService.deleteAppointmentDataMongo(idAppointment);

        LOG.infof("@deleteAppointmentData API > Finaliza ejecucion del servicio para eliminar el registro de una cita "
                + "en la base de datos con id: %s", idAppointment);

        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @POST
    @Path("/calculate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response calculateTotal(Appointment appointment) {
        double total = appointmentService.calculateTotal(
                appointment.getIdPet(),
                appointment.getServices()
        );
        return Response.ok(Map.of("total", total)).build();
    }
}
