package org.huellas.salud.repositories;

import io.quarkus.mongodb.panache.PanacheMongoRepository;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import org.huellas.salud.domain.service.ServiceMsg;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ServiceRepository implements PanacheMongoRepository<ServiceMsg> {

    private final Logger LOG = Logger.getLogger(ServiceRepository.class);

    public List<ServiceMsg> getRegisteredServicesMongo() {

        LOG.infof("@getRegisteredServicesMongo REPO > Inicia obtencion de los servicios registrados en mongo, estos se " +
                "retornaran ordenados de manera descendente por el campo de fecha de creacion");

        return listAll(Sort.descending("meta.fechaCreacion"));
    }

    public Optional<ServiceMsg> findServiceById(String idService) {

        LOG.infof("@findServiceById REPO > Inicia busqueda del registro del servicio con id: %s", idService);

        return find("data.idServicio = ?1", idService).firstResultOptional();
    }

    public Optional<ServiceMsg> findServiceByName(String name) {

        LOG.infof("@findServiceByName REPO > Inicia busqueda del registro del servicio con nombre " +
                "%s en mongo", name);

        return find("data.nombre = ?1", name).firstResultOptional();
    }

    public long deleteServiceDataMongo(String ServiceId) {

        LOG.infof("@deleteServiceDataMongo REPO > Inicia servicio de eliminacion del servicio con el id: %s " +
                "en mongo", ServiceId);

        return delete("data.idServicio = ?1", ServiceId);
    }
}