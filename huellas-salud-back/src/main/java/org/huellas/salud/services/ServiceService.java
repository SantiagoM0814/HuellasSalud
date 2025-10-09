package org.huellas.salud.services;

import io.quarkus.cache.CacheInvalidateAll;
import io.quarkus.cache.CacheResult;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.huellas.salud.domain.Meta;
import org.huellas.salud.domain.service.Service;
import org.huellas.salud.domain.service.ServiceMsg;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.jwt.JwtService;
import org.huellas.salud.helper.utils.Utils;
import org.huellas.salud.repositories.MediaFileRepository;
import org.huellas.salud.repositories.ServiceRepository;
import org.jboss.logging.Logger;

import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.Optional;

@ApplicationScoped
public class ServiceService {

    private static final Logger LOG = Logger.getLogger(ServiceService.class);

    @Inject
    Utils utils;

    @Inject
    JwtService jwtService;

    @Inject
    ServiceRepository serviceRepository;

    @Inject
    MediaFileRepository mediaFileRepository;

    @CacheInvalidateAll(cacheName = "services-list-cache")
    public ServiceMsg saveServiceDataMongo(ServiceMsg serviceMsg) throws HSException, UnknownHostException {

        LOG.infof("@saveServiceDataMongo SERV > Inicia ejecucion de servicio para almacenar el registro de un " +
                "servicio con la data: %s. Inicia la validacion de la informacion del servicio", serviceMsg.getData());

        Service serviceData = serviceMsg.getData();

        if (serviceRepository.findServiceByName(serviceData.getName()).isPresent()) {

            LOG.errorf("@saveServiceDataMongo SERV > El servicio con el nombre: %s ya esta registrado en mongo", serviceData.getName());

            throw new HSException(Response.Status.BAD_REQUEST, "El servicio con nombre: " + serviceData.getName() + ", ya " +
                    "esta registrado.");
        }

        LOG.infof("@saveServiceDataMongo SERV > Finaliza validacion de la informacion. El servicio con nombre: %s " +
                "no ha sido almacenado. Inicia almacenamiento del registro en mongo con la data: %s", serviceData.getName(), serviceData);

        serviceData.setName(utils.capitalizeWords(serviceData.getName()));

        serviceMsg.setMeta(utils.getMetaToEntity());
        serviceData.setIdService(UUID.randomUUID().toString());

        serviceRepository.persist(serviceMsg);

        LOG.infof("@saveServiceDataMongo SERV > El servicio se registro exitosamente en la base de datos. Finaliza " +
                "ejecucion de servicio para almacenar el registro de un servicio con la data: %s", serviceMsg);

        return serviceMsg;
    }

    @CacheResult(cacheName = "services-list-cache")
    public List<ServiceMsg> getListServiceMsg() {

        LOG.infof("@getListServiceMsg SERV > Inicia ejecucion del servicio para obtener listado de los servicios desde " +
                "mongo. Inicia consulta a mongo para obtener la informacion");

        List<ServiceMsg> services = serviceRepository.getRegisteredServicesMongo();

        services.forEach(serviceMsg -> {
            mediaFileRepository.getMediaByEntityTypeAndId("SERVICE", serviceMsg.getData().getIdService())
                    .ifPresent(media -> serviceMsg.getData().setMediaFile(media.getData()));
        });

        LOG.infof("@getListServiceMsg SERV > Finaliza consulta en mongo. Finaliza ejecucion del servicio para " +
                "obtener el listado de los servicios desde mongo. Se obtuvo: %s registros", services.size());

        return services;
    }
}