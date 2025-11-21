package org.huellas.salud.rest;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.huellas.salud.domain.schedule.ScheduleMsg;
import org.huellas.salud.services.ScheduleService;
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

import java.net.UnknownHostException;
import java.util.List;

@Path("/internal/schedule")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ScheduleApi {

    private static final Logger LOG = Logger.getLogger(ScheduleApi.class);

    @Inject
    ScheduleService scheduleService;

    @GET
    @Path("/list-schedules")
    @RolesAllowed({"ADMINISTRADOR", "VETERINARIO"})
    @Tag(name = "Gestión de horarios")
    @APIResponses(
            value = {
                @APIResponse(
                        responseCode = "200",
                        description = "Se retorna el listado de los horarios registrados correctamente",
                        content = @Content(schema = @Schema(implementation = ScheduleMsg.class, type = SchemaType.ARRAY))
                )
            }
    )
    @Operation(
            summary = "Obtención de todos los horarios registrados",
            description = "Permite obtener un listado con la información de los horarios registrados en la base de datos"
    )
    public Response getListSchedules() {

        LOG.infof("@getListSchedules API > Inicia servicio para obtener listado de todos los horarios registrados en mongo");

        List<ScheduleMsg> schedules = scheduleService.getListScheduleMsg();

        LOG.infof("@getListSchedules API > Finaliza servicio para obtener el listado de todos los horarios "
                + "registrados. Se encontraron: %s registros", schedules.size());

        return Response.ok().entity(schedules).build();
    }

    @GET
    @Path("/list-schedules-veterinarian/{idVeterinarian}")
    @RolesAllowed({"ADMINISTRADOR", "VETERINARIO"})
    @Tag(name = "Gestión de horarios")
    @APIResponses(
            value = {
                @APIResponse(
                        responseCode = "200",
                        description = "Se retorna el listado de los horarios del veterinario correctamente",
                        content = @Content(schema = @Schema(implementation = ScheduleMsg.class, type = SchemaType.ARRAY))
                ),
                @APIResponse(
                        responseCode = "404",
                        description = "No se encontraron horarios para el veterinario indicado"
                )
            }
    )
    @Operation(
            summary = "Obtención de horarios de un veterinario",
            description = "Permite obtener el listado de los horarios registrados, asociados a un veterinario específico según su número de documento"
    )
    public Response getListSchedulesVeterinarian(@PathParam("idVeterinarian") String idVeterinarian) {

        LOG.infof("@getListSchedulesVeterinarian API > Inicia servicio para obtener el listado de horarios del veterinario con documento: %s", idVeterinarian);

        List<ScheduleMsg> schedules = scheduleService.getListSchedulesVeterinarian(idVeterinarian);

        if (schedules == null || schedules.isEmpty()) {
            LOG.warnf("@getListSchedulesVeterinarian API > No se encontraron horarios para el veterinario con documento: %s", idVeterinarian);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("No se encontraron horarios para el veterinario con documento: " + idVeterinarian)
                    .build();
        }

        LOG.infof("@getListSchedulesVeterinarian API > Finaliza servicio. Se encontraron %s horarios para el veterinario con documento: %s", schedules.size(), idVeterinarian);

        return Response.ok().entity(schedules).build();
    }

    @POST
    @Path("/create")
    @RolesAllowed("ADMINISTRADOR")
    @Tag(name = "Gestión de horarios")
    @Operation(
            summary = "Creación de un horario nuevo",
            description = "Permite crear el registro de un horario nuevo en la base de datos con la informacion suministrada"
    )
    public Response createScheduleData(
            @RequestBody(
                    name = "scheduleMsg",
                    description = "Objeto con la información del horario que se va a crear",
                    required = true,
                    content = @Content(example = """
                        {
                                "data": {
                                        "idVeterinarian": "1013100931",
                                        "dayOfWeek": "MONDAY",
                                        "startTime": "08:00",
                                        "endTime": "17:00",
                                        "lunchStart": "12:00",
                                        "lunchEnd": "13:00",
                                        "active": true
                                }
                        }"""
                    )
            )
            @NotNull(message = "Debe ingresar el objeto data con la informacion del horario a registrar")
            @Valid @ConvertGroup(to = ValidationGroups.Post.class) ScheduleMsg scheduleMsg
    ) throws UnknownHostException, HSException {

        LOG.infof("@createScheduleData API > Inicia ejecucion del servicio para crear el registro de un horario "
                + "en base de datos con la data: %s", scheduleMsg.getData());

        ScheduleMsg scheduleCreated = scheduleService.saveScheduleDataMongo(scheduleMsg);

        LOG.infof("@createScheduleData API > Finaliza ejecucion del servicio para crear el registro de un horario "
                + "en base de datos. Se registro la siguiente informacion: %s", scheduleMsg);

        return Response.status(Response.Status.CREATED)
                .entity(scheduleCreated)
                .build();
    }

    @PUT
    @Path("/update")
    @RolesAllowed("ADMINISTRADOR")
    @Tag(name = "Gestión de horarios")
    @Operation(
            summary = "Actualización de la información de un horario",
            description = "Permite actualizar la información de un horario registrado en la base de datos"
    )
    public Response updateScheduleData(
            @RequestBody(
                    name = "scheduleMsg",
                    description = "Información con la que se actualizara el horario",
                    required = true,
                    content = @Content(example = """
                        {
                                "data": {
                                        "idSchedule": "f6ecbd20-3d6c-44f5-a74f-ba62ce794d27",
                                        "idVeterinarian": "1013100931",
                                        "dayOfWeek": "MONDAY",
                                        "startTime": "08:00",
                                        "endTime": "17:00",
                                        "lunchStart": "12:00",
                                        "lunchEnd": "13:00",
                                        "active": true
                                }
                        }"""
                    )
            )
            @NotNull(message = "Debe ingresar los datos del horario a actualizar")
            @ConvertGroup(to = ValidationGroups.Put.class) @Valid ScheduleMsg scheduleMsg
    ) throws HSException {

        LOG.infof("@updateScheduleData API > Inicia ejecucion del servicio para actualiazr el registro de un horario "
                + "en la base de datos con la data: %s", scheduleMsg);

        scheduleService.updateScheduleDataMongo(scheduleMsg);
        ScheduleMsg scheduleUpdated = scheduleService.getScheduleById(scheduleMsg.getData().getIdSchedule());

        LOG.debugf("@updateScheduleData API > Finaliza ejecucion del servicio para actualizar el registro de un horario "
                + "en base de datos con la informacion: %s", scheduleMsg);

        return Response.ok(scheduleUpdated)
                .build();
    }

    @DELETE
    @Path("/delete")
    @RolesAllowed("ADMINISTRADOR")
    @Tag(name = "Gestión de horarios")
    @Operation(
            summary = "Eliminación de un horario",
            description = "Permite eliminar el registro de un horario en la base de datos"
    )
    public Response deleteScheduleData(
            @Parameter(
                    name = "idSchedule",
                    description = "Identificador del horario a eliminar",
                    required = true,
                    example = "faf32d41-65b2-431b-a468-0dbc6650ae47"
            )
            @NotBlank(message = "Debe ingresar el identificador (idSchedule) del horario a eliminar")
            @QueryParam("idSchedule") String idSchedule
    ) throws HSException {

        LOG.infof("@deleteScheduleData API > Inicia ejecucion del servicio para eliminar el registro de un horario "
                + "en la base de datos con id: %s", idSchedule);

        scheduleService.deleteScheduleDataMongo(idSchedule);

        LOG.infof("@deleteScheduleData API > Finaliza ejecucion del servicio para eliminar el registro de un horario "
                + "en la base de datos con id: %s", idSchedule);

        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
