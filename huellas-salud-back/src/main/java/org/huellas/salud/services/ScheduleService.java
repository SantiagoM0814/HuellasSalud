package org.huellas.salud.services;

import io.quarkus.cache.CacheInvalidateAll;
import io.quarkus.cache.CacheResult;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import org.huellas.salud.domain.schedule.Schedule;
import org.huellas.salud.repositories.ScheduleRepository;
import org.huellas.salud.repositories.UserRepository;
import org.huellas.salud.domain.user.UserMsg;
import org.huellas.salud.domain.Meta;
import org.huellas.salud.domain.schedule.ScheduleMsg;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.jwt.JwtService;
import org.huellas.salud.helper.utils.Utils;
import org.jboss.logging.Logger;
import java.util.Optional;
import jakarta.ws.rs.core.Response;

import java.net.UnknownHostException;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

@ApplicationScoped
public class ScheduleService {

    private static final Logger LOG = Logger.getLogger(ScheduleService.class);

    @Inject
    Utils utils;

    @Inject
    JwtService jwtService;

    @Inject
    ScheduleRepository scheduleRepository;

    @Inject
    UserRepository userRepository;

    @CacheInvalidateAll(cacheName = "schedules-list-cache")
    public ScheduleMsg saveScheduleDataMongo(ScheduleMsg scheduleMsg) throws HSException, UnknownHostException {

        LOG.infof("@saveScheduleDataMongo SERV > Inicia ejecucion del servicio para almacenar el registro de un "
                + "horario con la data: %s. Inicia validacion de la informacion de la cita", scheduleMsg.getData());

        Schedule scheduleData = scheduleMsg.getData();

        Optional<UserMsg> optionalUser = userRepository.findUserByDocumentNumber(scheduleData.getIdVeterinarian());

        if (optionalUser.isEmpty()) {
            LOG.warnf("@saveScheduleDataMongo SERV > No se encontro ningun veterinario con el numero de documento: %s", scheduleData.getIdVeterinarian());
            throw new HSException(Response.Status.BAD_REQUEST, "No se encontró el veterinario con documento: " + scheduleData.getIdVeterinarian());
        }

        String diaEsp = traducirDia(scheduleData.getDayOfWeek().name());

        boolean exists = scheduleRepository.existsScheduleForDay(scheduleData.getIdVeterinarian(), scheduleData.getDayOfWeek());
        if (exists) {
            LOG.warnf("@saveScheduleDataMongo SERV > El veterinario %s ya tiene un horario para el día %s",
                    scheduleData.getIdVeterinarian(), diaEsp);
            throw new HSException(Response.Status.BAD_REQUEST,
                    "El veterinario ya tiene un horario registrado para el día " + diaEsp);
        }

        LOG.infof("@saveScheduleDataMongo SERV > Inicia formato de la informacion enviada y se agrega metadata");

        scheduleData.setIdSchedule(UUID.randomUUID().toString());
        scheduleMsg.setMeta(utils.getMetaToEntity());

        LOG.infof("@saveScheduleDataMongo SERV > Finaliza formato de la data. Se realiza el registro del horario "
                + "en mongo con la siguiente informacion: %s", scheduleMsg);

        scheduleRepository.persist(scheduleMsg);

        LOG.infof("@saveScheduleDataMongo SERV > El horario se registro exitosamente en la base de datos. Finaliza "
                + "ejecucion del servicio para almacenar el registro de un horario con la data: %s", scheduleMsg);

        return scheduleMsg;
    }

    public ScheduleMsg getScheduleById(String idSchedule) {

        LOG.infof("@getScheduleById SERV > Inicia ejecucion del servicio para obtener el horario con id: %s."
                + " Inicia consulta en mongo.", idSchedule);

        Optional<ScheduleMsg> optionalSchedule = scheduleRepository.findScheduleById(idSchedule);

        if (optionalSchedule.isEmpty()) {
            LOG.warnf("@getScheduleById SERV > No se encontro ningun horario con el id: %s", idSchedule);
            return null;
        }

        ScheduleMsg schedule = optionalSchedule.get();

        LOG.infof("@getScheduleById SERV > Finaliza consulta del horario en mongo. Se obtuvo el registro "
                + "del horario con el id: %s", idSchedule);

        return schedule;
    }

    @CacheResult(cacheName = "schedules-list-cache")
    public List<ScheduleMsg> getListScheduleMsg() {

        LOG.infof("@getListScheduleMsg SERV > Inicia ejecucion del servicio para obtener el listado de los horarios "
                + "en mongo. Incia consulta a mongo para obtener la información");

        List<ScheduleMsg> schedules = scheduleRepository.getListScheduleMongo();

        LOG.infof("@getListScheduleMsg SERV > Finaliza consulta en mongo. Finaliza ejecucion del servicio para "
                + "obtener el listado de los horarios desde mongo. Se obtuvo: %s registros", schedules.size());

        return schedules;
    }

    public List<ScheduleMsg> getListSchedulesVeterinarian(String idVeterinarian) {

        LOG.infof("@getListSchedulesVeterinarian SERV > Inicia la ejecucion del servicio para obetner el listado de horarios "
                + "del veterinario con numero de documento: %s", idVeterinarian);

        List<ScheduleMsg> schedules = scheduleRepository.getListSchedulesVeterinarian(idVeterinarian);

        LOG.infof("@getListSchedulesVeterinarian SERV > Finaliza la consulta de horarios en mongo. Se obtuvo: %s registros "
                + "de horarios relacionadas al veterinario con numero de documento: %s", schedules.size(), idVeterinarian);

        return schedules;
    }

    @CacheInvalidateAll(cacheName = "schedules-list-cache")
    public void updateScheduleDataMongo(ScheduleMsg scheduleMsg) throws HSException {

        LOG.infof("@updateScheduleDataMongo SERV > Inicia la ejecucion del servicio para actualizar registro de "
                + "el horario con id: %s. Data a modificar: %s", scheduleMsg.getData().getIdSchedule(), scheduleMsg);

        ScheduleMsg scheduleMsgMongo = getScheduleMsg(scheduleMsg.getData().getIdSchedule());

        String diaEsp = traducirDia(scheduleMsg.getData().getDayOfWeek().name());

        boolean exists = scheduleRepository.existsScheduleForDayExcludingId(
                scheduleMsg.getData().getIdVeterinarian(),
                scheduleMsg.getData().getDayOfWeek().name(),
                scheduleMsg.getData().getIdSchedule()
        );


        if (exists) {
            throw new HSException(Response.Status.BAD_REQUEST,
                    "El veterinario ya tiene un horario registrado para el día "
                    + diaEsp
            );
        }

        setScheduleInformation(scheduleMsg.getData().getIdSchedule(), scheduleMsg.getData(), scheduleMsgMongo);

        LOG.infof("@updateScheduleDataMongo SERV > El horario con id: %s si esta registrado. Inicia la "
                + "actualizacion del registro del horario con data: %s", scheduleMsg.getData().getIdSchedule(), scheduleMsg);

        LOG.infof("@updateScheduleDataMongo SERV > Finaliza edicion de la informacion del horario con id: %s. "
                + "Inicia actualizacion en mongo con la data: %s", scheduleMsg.getData().getIdSchedule(), scheduleMsg);

        scheduleRepository.update(scheduleMsgMongo);

        LOG.infof("@updateScheduleDataMongo SERV > Finaliza actualizacion del registro del horario con id: %s. "
                + "Finaliza ejecucion de servicio de actualizacion", scheduleMsg.getData().getIdSchedule());
    }

    private void setScheduleInformation(String idSchedule, Schedule scheduleRequest, ScheduleMsg scheduleMsgMongo) {

        LOG.infof("@setScheduleInformation SERV > Inicia set de los datos del horario con id: %s", idSchedule);

        Schedule scheduleMongo = scheduleMsgMongo.getData();
        Meta metaMongo = scheduleMsgMongo.getMeta();

        scheduleMongo.setIdVeterinarian(scheduleRequest.getIdVeterinarian());
        scheduleMongo.setDayOfWeek(scheduleRequest.getDayOfWeek());
        scheduleMongo.setStartTime(scheduleRequest.getStartTime());
        scheduleMongo.setEndTime(scheduleRequest.getEndTime());
        scheduleMongo.setLunchStart(scheduleRequest.getLunchStart());
        scheduleMongo.setLunchEnd(scheduleRequest.getLunchEnd());
        scheduleMongo.setActive(scheduleRequest.isActive());

        metaMongo.setLastUpdate(LocalDateTime.now());
        metaMongo.setNameUserUpdated(jwtService.getCurrentUserName());
        metaMongo.setEmailUserUpdated(jwtService.getCurrentUserEmail());
        metaMongo.setRoleUserUpdated(jwtService.getCurrentUserRole());

        LOG.infof("@setScheduleInformation SERV > Finaliza set de los datos del horario con id: %s", idSchedule);
    }

    @CacheInvalidateAll(cacheName = "schedules-list-cache")
    public void deleteScheduleDataMongo(String idSchedule) throws HSException {

        LOG.infof("@deleteScheduleDataMongo SERV > Inicia ejecucion del servicio para eliminar el registro del "
                + "horario con id: %s", idSchedule);

        long deletedRecords = scheduleRepository.deleteScheduleDataMongo(idSchedule);

        if (deletedRecords == 0) {

            LOG.errorf("@deleteScheduleDataMongo SERV > El registro del horario con id: %s no existe en mongo. No se "
                    + "elimina el registro.", idSchedule);

            throw new HSException(Response.Status.NOT_FOUND, "El horario con id: " + idSchedule + ". No esta registrada en base de datos");
        }

        LOG.infof("@deleteScheduleDataMongo SERV > Finaliza ejecucion del servicio para eliminar el registro del horario "
                + "con id: %s. El registro se elimino correctamente.", idSchedule);
    }

    private ScheduleMsg getScheduleMsg(String idSchedule) throws HSException {

        return scheduleRepository.findScheduleById(idSchedule).orElseThrow(() -> {

            LOG.errorf("@getScheduleMsg SERV > El horario con el id: %s No esta registrado. "
                    + "Solicitud invalida no se puede modificar el registro", idSchedule);

            return new HSException(Response.Status.NOT_FOUND, "No se encontro el registro del horario con "
                    + "id: " + idSchedule + " en la base de datos");
        });
    }

    private String traducirDia(String day) {
        return switch (day.toUpperCase()) {
            case "MONDAY" -> "LUNES";
            case "TUESDAY" -> "MARTES";
            case "WEDNESDAY" -> "MIERCOLES";
            case "THURSDAY" -> "JUEVES";
            case "FRIDAY" -> "VIERNES";
            case "SATURDAY" -> "SABADO";
            case "SUNDAY" -> "DOMINGO";
            default -> day;
        };
    }
}
