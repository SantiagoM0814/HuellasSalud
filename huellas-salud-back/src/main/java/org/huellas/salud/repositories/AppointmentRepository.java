package org.huellas.salud.repositories;

import org.huellas.salud.domain.appointment.AppointmentMsg;
import org.jboss.logging.Logger;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

import java.util.List;

@ApplicationScoped
public class AppointmentRepository implements PanacheMongoRepository<AppointmentMsg> {

    private static final Logger LOG = Logger.getLogger(AppointmentRepository.class);

    public Optional<AppointmentMsg> findAppointmentById(String idAppointment) {

        LOG.infof("@findAppointmentById REPO > Inicia busqueda del registro de la cita con id: %s", idAppointment);

        return find("data.idCita = ?1", idAppointment).firstResultOptional();
    }

    public List<AppointmentMsg> getListAppointmentsUser (String userDocument) {

        LOG.infof("@getListAppointmentsUser REPO > Inicia busqueda de las citas relacionadas con"
            + " el usuario con numero de documento: %s", userDocument);

        return list("data.idPropietario = ?1", userDocument);
    }

    public List<AppointmentMsg> getListAppointmentsMongo() {

        LOG.infof("@getListAppointmentsMongo REPO > Inicia la obtencion del listado de citas registradas "
            + "en mongo");

        return listAll(Sort.descending("meta.fechaCreacion"));
    }

    public long deleteAppointmentDataMongo (String idAppointment) {

        LOG.infof("@deleteAppointmentDataMongo REPO > Inicia eliminacion del registro de la cita con id: %s", idAppointment);

        return delete("data.idCita = ?1", idAppointment);
    }
}