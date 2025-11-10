package org.huellas.salud.repositories;

import org.huellas.salud.domain.appointment.AppointmentMsg;
import org.jboss.logging.Logger;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

import java.util.List;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;

@ApplicationScoped
public class AppointmentRepository implements PanacheMongoRepository<AppointmentMsg> {

    private static final Logger LOG = Logger.getLogger(AppointmentRepository.class);

    public Optional<AppointmentMsg> findAppointmentById(String idAppointment) {

        LOG.infof("@findAppointmentById REPO > Inicia busqueda del registro de la cita con id: %s", idAppointment);

        return find("data.idCita = ?1", idAppointment).firstResultOptional();
    }

    public List<AppointmentMsg> getListAppointmentsUser(String userDocument) {

        LOG.infof("@getListAppointmentsUser REPO > Inicia busqueda de las citas relacionadas con"
                + " el usuario con numero de documento: %s", userDocument);

        return list("data.idPropietario = ?1", Sort.descending("meta.fechaCreacion"), userDocument);
    }

    public List<AppointmentMsg> getListAppointmentsVeterinarian(String userDocument) {

        LOG.infof("@getListAppointmentsVeterinarian REPO > Inicia busqueda de las citas relacionadas con"
                + " el veterinario con numero de documento: %s", userDocument);

        return list("data.idVeterinario = ?1", Sort.by("data.fechaHora").descending(), userDocument);
    }

    public List<AppointmentMsg> getListAppointmentsMongo() {

        LOG.infof("@getListAppointmentsMongo REPO > Inicia la obtencion del listado de citas registradas "
                + "en mongo");

        return listAll(Sort.descending("meta.fechaCreacion"));
    }

    public long deleteAppointmentDataMongo(String idAppointment) {

        LOG.infof("@deleteAppointmentDataMongo REPO > Inicia eliminacion del registro de la cita con id: %s", idAppointment);

        return delete("data.idCita = ?1", idAppointment);
    }

    public boolean existsAppointmentInRange(String idVeterinarian, LocalDateTime newStart, LocalDateTime newEnd) {
        LOG.infof("@existsAppointmentInRange REPO > Verificando citas que se crucen entre %s y %s para el veterinario %s",
                newStart, newEnd, idVeterinarian);

        return find("data.idVeterinario = ?1", idVeterinarian)
                .stream()
                .map(AppointmentMsg.class::cast)
                .map(AppointmentMsg::getData)
                .anyMatch(existing -> {
                    LocalDateTime existingStart = existing.getDateTime();
                    LocalDateTime existingEnd = existingStart.plusMinutes(30);
                    // ✅ Solo hay conflicto si se cruzan de verdad
                    return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
                });
    }

    public List<AppointmentMsg> findAppointmentsByVeterinarianAndDate(String idVeterinarian, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        return list("data.idVeterinario = ?1 and data.fechaHora >= ?2 and data.fechaHora <= ?3",
                idVeterinarian, startOfDay, endOfDay);
    }
}
