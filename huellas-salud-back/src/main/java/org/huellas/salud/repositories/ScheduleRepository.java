package org.huellas.salud.repositories;

import org.huellas.salud.domain.schedule.ScheduleMsg;
import org.jboss.logging.Logger;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

import java.util.List;

@ApplicationScoped
public class ScheduleRepository implements PanacheMongoRepository<ScheduleMsg> {

    private static final Logger LOG = Logger.getLogger(ScheduleRepository.class);

    public Optional<ScheduleMsg> findScheduleById(String idSchedule) {

        LOG.infof("@findScheduleById REPO > Inicia busqueda del registro del horario con id: %s", idSchedule);

        return find("data.idHorario = ?1", idSchedule).firstResultOptional();
    }

    public List<ScheduleMsg> getListSchedulesVeterinarian (String idVeterinarian) {

        LOG.infof("@getListSchedulesVeterinarian REPO > Inicia busqueda de horario relacionadas con"
            + " el veterinario con id: %s", idVeterinarian);

        return list("data.idVeterinario = ?1", Sort.ascending("data.diaSemana"), idVeterinarian);
    }

    public List<ScheduleMsg> getListScheduleMongo() {

        LOG.infof("@getListScheduleMongo REPO > Inicia la obtencion del listado de horarios registrados "
            + "en mongo");

        return listAll(Sort.descending("meta.fechaCreacion"));
    }

    public long deleteScheduleDataMongo (String idSchedule) {

        LOG.infof("@deleteScheduleDataMongo REPO > Inicia eliminacion del registro de horario con id: %s", idSchedule);

        return delete("data.idHorario = ?1", idSchedule);
    }
}