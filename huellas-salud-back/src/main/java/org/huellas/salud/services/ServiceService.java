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

    @CacheInvalidateAll(cacheName = "services-list-cache")
    public void updateServiceDataMongo(ServiceMsg serviceMsg) throws HSException {
        LOG.infof("@updateServiceDataMongo SERV > Inicia ejecucion del servicio para actualizar el registro de un " +
                "servicio con el id: %s. Data a modificar: %s", serviceMsg.getData().getIdService(), serviceMsg);

        ServiceMsg serviceMsgMongo = getServiceMsg(serviceMsg.getData().getIdService());

        LOG.infof("@updateServiceDataMongo SERV > El servicio con id: %s si esta registrado. Inicia la " +
                "actualizacion del registro del servicio con data; %s", serviceMsg.getData().getIdService(), serviceMsg);
        
        setServiceInformation(serviceMsg.getData().getIdService(), serviceMsg.getData(), serviceMsgMongo);
        
        LOG.infof("@updateServiceDataMongo SERV > Finaliza edicion de la informacion del servicio con id: %s. " +
                "Inicia actualizacion del registro en mongo con la data: %s", serviceMsg.getData().getIdService(), serviceMsg);
        
        serviceRepository.update(serviceMsgMongo);

        LOG.infof("updateServiceDataMongo SERV > Finaliza actualizacion del registro del servicio con id: %s. " +
                "Finaliza ejecucion del servicio de actualizacion", serviceMsg.getData().getIdService());
    }

    @CacheInvalidateAll(cacheName = "services-list-cache")
    public void deleteServiceDataMongo(String idService) throws HSException {
        LOG.infof("@deleteServiceDataMongo SERV > Inicia ejecucion del servicio para eliminar el registro de un " +
                "servicio con el id: %s de mongo", idService);

        long deleted = serviceRepository.deleteServiceDataMongo(idService);

        if(deleted == 0) {

                LOG.errorf("@deleteServiceDataMongo SERV > El registro del servicio con id: %s no " +
                        "existe en mongo. No se realiza eliminacion. Registros eliminados: %s", idService, deleted);

                throw new HSException(Response.Status.NOT_FOUND, "El servicio con id: " + idService + "No esta " +
                        "registrado en la base de datos.");
        }

        LOG.infof("@deleteServiceDataMongo SERV > El registro del servicio con id: %s se elimino correctamente de " +
                "mongo. Finaliza ejecucion del servicio para eliminar usuario y se elimino %s registro de la base " +
                "de datos", idService, deleted);
    }

    private void setServiceInformation(String idService, Service serviceRequest, ServiceMsg serviceMsgMongo) {

        LOG.infof("@setServiceInformation SERV > Inicia set de los datos del servicio con id: %s", idService);

        Service serviceMongo = serviceMsgMongo.getData();
        Meta metaMongo = serviceMsgMongo.getMeta();

        serviceMongo.setName(serviceRequest.getName());
        serviceMongo.setShortDescription(serviceRequest.getShortDescription());
        serviceMongo.setLongDescription(serviceRequest.getLongDescription());
        serviceMongo.setBasePrice(serviceRequest.getBasePrice());
        serviceMongo.setPriceByWeight(serviceRequest.isPriceByWeight());
        serviceMongo.setWeightPriceRules(serviceRequest.getWeightPriceRules());
        
        metaMongo.setLastUpdate(LocalDateTime.now());
        metaMongo.setNameUserUpdated(jwtService.getCurrentUserName());
        metaMongo.setEmailUserUpdated(jwtService.getCurrentUserEmail());
        metaMongo.setRoleUserUpdated(jwtService.getCurrentUserRole());
        
        LOG.infof("@setServiceInformation SERV > Finaliza set de los datos del servicio con id: %s", idService);
    }

    private ServiceMsg getServiceMsg(String idService) throws HSException {

        return serviceRepository.findServiceById(idService).orElseThrow(() -> {

                LOG.errorf("@getServiceMsg SERV > El servicio con id: %s No esta registrado." +
                        " Solicitud invalida no se puede modificado el registro", idService);

                return new HSException(Response.Status.NOT_FOUND, "No se encontro el registro del servicio con id: " + idService +
                        " en la base de datos");
        });
    }
}