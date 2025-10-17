package org.huellas.salud.services;

import io.quarkus.cache.CacheInvalidateAll;
import io.quarkus.cache.CacheResult;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import org.huellas.salud.domain.appointment.Appointment;
import org.huellas.salud.repositories.AppointmentRepository;
import org.huellas.salud.repositories.PetRepository;
import org.huellas.salud.domain.pet.PetMsg;
import org.huellas.salud.repositories.UserRepository;
import org.huellas.salud.domain.user.UserMsg;
import org.huellas.salud.domain.Meta;
import org.huellas.salud.domain.appointment.AppointmentMsg;
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
public class AppointmentService {

    private static final Logger LOG = Logger.getLogger(AppointmentService.class);

    @Inject
    Utils utils;

    @Inject
    JwtService jwtService;

    @Inject
    AppointmentRepository appointmentRepository;

    @Inject
    UserRepository userRepository;

    @Inject
    PetRepository petRepository;

    @CacheInvalidateAll(cacheName = "appointments-list-cache")
    public AppointmentMsg saveAppointmentDataMongo(AppointmentMsg appointmentMsg) throws HSException, UnknownHostException {

        LOG.infof("@saveAppointmentDataMongo SERV > Inicia ejecucion del servicio para almacenar el registro de una "
            + "cita con la data: %s. Inicia validacion de la informacion de la cita", appointmentMsg.getData());

        Appointment appointmentData = appointmentMsg.getData();

        Optional<UserMsg> optionalUser = userRepository.findUserByDocumentNumber(appointmentData.getIdOwner());

        if(optionalUser.isEmpty()) {
            LOG.warnf("@saveAppointmentDataMongo SERV > No se encontro ningun usuario con el numero de documento: %s", appointmentData.getIdOwner());
            throw new HSException(Response.Status.BAD_REQUEST, "No se encontró el usuario con documento: " + appointmentData.getIdOwner());
        }

        Optional<PetMsg> optionalPet = petRepository.findPetById(appointmentData.getIdPet());

        if(optionalPet.isEmpty()) {
            LOG.warnf("@saveAppointmentDataMongo SERV > No se encontro ninguna mascota con el id: %s", appointmentData.getIdPet());
            throw new HSException(Response.Status.BAD_REQUEST, "No se encontró la mascota con id: " + appointmentData.getIdPet());
        }

        PetMsg petMsg = optionalPet.get();

        if (!petMsg.getData().getIdOwner().equals(appointmentData.getIdOwner())) {
            throw new HSException(Response.Status.BAD_REQUEST,
                    "La mascota con ID " + appointmentData.getIdPet() + " no pertenece al usuario con documento " + appointmentData.getIdOwner());
        }

        LOG.infof("@saveAppointmentDataMongo SERV > Inicia formato de la info enviada y se agrega metadata");

        appointmentData.setIdAppointment(UUID.randomUUID().toString());
        appointmentMsg.setMeta(utils.getMetaToEntity());

        LOG.infof("@saveAppointmentDataMongo SERV > Finaliza formato de la data. Se realiza el registro de la cita "
            + "en mongo con la siguiente informacion: %s", appointmentMsg);

        appointmentRepository.persist(appointmentMsg);

        LOG.infof("@saveAppointmentDataMongo SERV > La cita se registro exitosamente en la base de datos. Finaliza "
            + "ejecucion del servicio para almacenar el registro de una cita con la data: %s", appointmentMsg);

        return appointmentMsg;
    }

    public AppointmentMsg getAppointmentById(String idAppointment) {

        LOG.infof("@getAppointmentById SERV > Inicia ejecucion del servicio para obtener la cita con id: %s."
            + " Inicia consulta en mongo.", idAppointment);

        Optional<AppointmentMsg> optionalAppointment = appointmentRepository.findAppointmentById(idAppointment);

        if (optionalAppointment.isEmpty()) {
            LOG.warnf("@getAppointmentById SERV > No se encontro ninguna cita con el id: %s", idAppointment);
            return null;
        }

        AppointmentMsg appointment = optionalAppointment.get();

        LOG.infof("@getAppointmentById SERV > Finaliza consulta de la cita en mongo. Se obtuvo el registro "
            + "de la cita con el id: %s", idAppointment);

        return appointment;
    }

    @CacheResult(cacheName = "appointments-list-cache")
    public List<AppointmentMsg> getListAppointmentMsg() {

        LOG.infof("@getListAppointmentMsg SERV > Inicia ejecucion del servicio para obtener el listado de las citas "
            + "en mongo. Incia consulta a mongo para obtener la información");

        List<AppointmentMsg> appointments = appointmentRepository.getListAppointmentsMongo();

        LOG.infof("@getListAppointmentMsg SERV > Finaliza consulta en mongo. Finaliza ejecucion del servicio para "
            + "obtener el listado de las citas desde mongo. Se obtuvo: %s registros", appointments.size());

        return appointments;
    }

    public List<AppointmentMsg> getListAppointmentsUser(String idOwner) {

        LOG.infof("@getListAppointmentsUser SERV > Inicia la ejecucion del servicio para obetner el listado de citas "
            + "del usuario con numero de documento: %s", idOwner);

        List<AppointmentMsg> appointments = appointmentRepository.getListAppointmentsUser(idOwner);

        LOG.infof("@getListAppointmentsUser SERV > Finaliza la consulta de citas en mongo. Se obtuvo: %s registros "
            + "de citas relacionadas al usuario con numero de documento: %s", appointments.size(), idOwner);

        return appointments;
    }

    @CacheInvalidateAll(cacheName = "appointments-list-cache")
    public void updateAppointmentDataMongo(AppointmentMsg appointmentMsg) throws HSException {

        LOG.infof("@updateAppointmentDataMongo SERV > Inicia la ejecucion del servicio para actualizar registro de "
            + "la cita con el id: %s. Data a modificar: %s", appointmentMsg.getData().getIdAppointment(), appointmentMsg);

        AppointmentMsg appointmentMsgMongo = getAppointmentMsg(appointmentMsg.getData().getIdAppointment());

        setAppointmentInformation(appointmentMsg.getData().getIdAppointment(), appointmentMsg.getData(), appointmentMsgMongo);

        LOG.infof("@updateAppointmentDataMongo SERV > La cita con id: %s si esta registrada. Inicia la "
            + "actualizacion del registro de la cita con data: %s", appointmentMsg.getData().getIdAppointment(), appointmentMsg);

        LOG.infof("@updateAppointmentDataMongo SERV > Finaliza edicion de la informacion de la cita con id: %s. "
            + "Inicia actualizacion en mongo con la data: %s", appointmentMsg.getData().getIdAppointment(), appointmentMsg);

        appointmentRepository.update(appointmentMsgMongo);

        LOG.infof("@updateAppointmentDataMongo SERV > Finaliza actualizacion del registro de la cita con id: %s. "
            + "Finaliza ejecucion de servicio de actualizacion", appointmentMsg.getData().getIdAppointment());
    }

    private void setAppointmentInformation(String idAppointment, Appointment appointmentRequest, AppointmentMsg appointmentMsgMongo) {

        LOG.infof("@setAppointmentInformation SERV > Inicia set de los datos de la cita con id: %s", idAppointment);

        Appointment appointmentMongo = appointmentMsgMongo.getData();
        Meta metaMongo = appointmentMsgMongo.getMeta();

        appointmentMongo.setIdPet(appointmentRequest.getIdPet());
        appointmentMongo.setServices(appointmentRequest.getServices());
        appointmentMongo.setDateTime(appointmentRequest.getDateTime());
        appointmentMongo.setStatus(appointmentRequest.getStatus());
        appointmentMongo.setNotes(appointmentRequest.getNotes());
        appointmentMongo.setIdVeterinarian(appointmentRequest.getIdVeterinarian());

        metaMongo.setLastUpdate(LocalDateTime.now());
        metaMongo.setNameUserUpdated(jwtService.getCurrentUserName());
        metaMongo.setEmailUserUpdated(jwtService.getCurrentUserEmail());
        metaMongo.setRoleUserUpdated(jwtService.getCurrentUserRole());

        LOG.infof("@setAppointmentInformation SERV > Finaliza set de los datos de la cita con id: %s", idAppointment);
    }

    @CacheInvalidateAll(cacheName = "appointments-list-cache")
    public void deleteAppointmentDataMongo(String idAppointment) throws HSException {

        LOG.infof("@deleteAppointmentDataMongo SERV > Inicia ejecucion del servicio para eliminar el registro de la "
            + "cita con id: %s", idAppointment);

        long deletedRecords = appointmentRepository.deleteAppointmentDataMongo(idAppointment);

        if (deletedRecords == 0) {

            LOG.errorf("@deleteAppointmentDataMongo SERV > El registro de la cita con id: %s no existe en mongo. No se "
                + "elimina el registro.", idAppointment);

            throw new HSException(Response.Status.NOT_FOUND, "La cita con id: " + idAppointment + ". No esta registrada en base de datos");
        }

        LOG.infof("@deleteAppointmentDataMongo SERV > Finaliza ejecucion del servicio para eliminar el registro de la cita "
            + "con id: %s. El registro se elimino correctamente.", idAppointment);
    }

    private AppointmentMsg getAppointmentMsg(String idAppointment) throws HSException {

        return appointmentRepository.findAppointmentById(idAppointment).orElseThrow(() -> {

            LOG.errorf("@getAppointmentMsg SERV > La cita con el id: %s No esta registrada. "
                + "Solicitud invalida no se puede modificar el registro", idAppointment);

            return new HSException(Response.Status.NOT_FOUND, "No se encontro el registro de la cita con "
                + "id: " + idAppointment + " en la base de datos");
        });
    }
}