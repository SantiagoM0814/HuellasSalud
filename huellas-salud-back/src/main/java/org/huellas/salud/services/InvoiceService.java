package org.huellas.salud.services;

import io.quarkus.cache.CacheInvalidateAll;
import io.quarkus.cache.CacheResult;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import org.huellas.salud.domain.invoice.Invoice;
import org.huellas.salud.domain.invoice.InvoiceMsg;
import org.huellas.salud.domain.invoice.ItemInvoice;
import org.huellas.salud.domain.invoice.InvoiceStatus;
import org.huellas.salud.repositories.InvoiceRepository;

import org.huellas.salud.domain.product.Product;
import org.huellas.salud.domain.product.ProductMsg;
import org.huellas.salud.repositories.ProductRepository;

import org.huellas.salud.domain.appointment.Appointment;
import org.huellas.salud.repositories.AppointmentRepository;
import org.huellas.salud.domain.pet.Pet;
import org.huellas.salud.repositories.PetRepository;
import org.huellas.salud.domain.service.Service;
import org.huellas.salud.domain.service.ServiceMsg;
import org.huellas.salud.domain.service.WeightPriceRule;
import org.huellas.salud.repositories.ServiceRepository;
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
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;


import java.net.UnknownHostException;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.LocalDate;

@ApplicationScoped
public class InvoiceService {

    private static final Logger LOG = Logger.getLogger(InvoiceService.class);

    @Inject
    Utils utils;

    @Inject
    JwtService jwtService;

    @Inject
    InvoiceRepository invoiceRepository;

    @Inject
    UserRepository userRepository;

    @Inject
    ProductRepository productRepository;

    @Inject
    ServiceRepository serviceRepository;

    @CacheInvalidateAll(cacheName = "invoices-list-cache")
    public InvoiceMsg saveInvoiceDataMongo(InvoiceMsg invoiceMsg) throws HSException, UnknownHostException {

        LOG.infof("@saveInvoiceDataMongo SERV > Inicia ejecucion del servicio para almacenar el registro de una "
                + "factura con la data: %s. Inicia validacion de la informacion de la factura", invoiceMsg.getData());

        Invoice invoiceData = invoiceMsg.getData();

        Optional<UserMsg> optionalUser = userRepository.findUserByDocumentNumber(invoiceData.getIdClient());

        if (optionalUser.isEmpty()) {
            LOG.warnf("@saveInvoiceDataMongo SERV > No se encontro ningun usuario con el numero de documento: %s", invoiceData.getIdClient());
            throw new HSException(Response.Status.BAD_REQUEST, "No se encontró el usuario con documento: " + invoiceData.getIdClient());
        }

        for (ItemInvoice item : invoiceData.getItemInvoice()) {
            String idProduct = item.getIdProduct();
            String idService = item.getIdService();

            boolean hasProduct = idProduct != null && !idProduct.isBlank();
            boolean hasService = idService != null && !idService.isBlank();

            if (!hasProduct && !hasService) {
                throw new HSException(Response.Status.BAD_REQUEST,
                        "Cada ítem de la factura debe estar asociado al menos a un producto o un servicio.");
            }

            if (hasProduct) {
                Optional<ProductMsg> optionalProduct = productRepository.findProductById(idProduct);
                if (optionalProduct.isEmpty()) {
                    LOG.warnf("@saveInvoiceDataMongo SERV > No se encontró ningún producto con el id: %s", idProduct);
                    throw new HSException(Response.Status.BAD_REQUEST,
                            "No se encontró el producto con id: " + idProduct);
                }
            }

            if (hasService) {
                Optional<ServiceMsg> optionalService = serviceRepository.findServiceById(idService);
                if (optionalService.isEmpty()) {
                    LOG.warnf("@saveInvoiceDataMongo SERV > No se encontró ningún servicio con el id: %s", idService);
                    throw new HSException(Response.Status.BAD_REQUEST,
                            "No se encontró el servicio con id: " + idService);
                }
            }
        }

        LOG.infof("@saveInvoiceDataMongo SERV > Inicia formato de la info enviada y se agrega metadata");

        invoiceData.setIdInvoice(UUID.randomUUID().toString());
        invoiceMsg.setMeta(utils.getMetaToEntity());

        LOG.infof("@saveInvoiceDataMongo SERV > Finaliza formato de la data. Se realiza el registro de la factura "
                + "en mongo con la siguiente informacion: %s", invoiceMsg);

        invoiceRepository.persist(invoiceMsg);

        LOG.infof("@saveInvoiceDataMongo SERV > La factura se registro exitosamente en la base de datos. Finaliza "
                + "ejecucion del servicio para almacenar el registro de una factura con la data: %s", invoiceMsg);

        return invoiceMsg;
    }

    public InvoiceMsg getInvoiceById(String idInvoice) {

        LOG.infof("@getInvoiceById SERV > Inicia ejecucion del servicio para obtener la factura con id: %s."
                + " Inicia consulta en mongo.", idInvoice);

        Optional<InvoiceMsg> optionalInvoice = invoiceRepository.findInvoiceById(idInvoice);

        if (optionalInvoice.isEmpty()) {
            LOG.warnf("@getInvoiceById SERV > No se encontro ninguna factura con el id: %s", idInvoice);
            return null;
        }

        InvoiceMsg invoice = optionalInvoice.get();

        LOG.infof("@getInvoiceById SERV > Finaliza consulta de la factura en mongo. Se obtuvo el registro "
                + "de la factura con el id: %s", idInvoice);

        return invoice;
    }

    @CacheResult(cacheName = "invoices-list-cache")
    public List<InvoiceMsg> getListInvoiceMsg() {

        LOG.infof("@getListInvoiceMsg SERV > Inicia ejecucion del servicio para obtener el listado de las facturas "
                + "en mongo. Incia consulta a mongo para obtener la información");

        List<InvoiceMsg> invoices = invoiceRepository.getListInvoicesMongo();

        LOG.infof("@getListInvoiceMsg SERV > Finaliza consulta en mongo. Finaliza ejecucion del servicio para "
                + "obtener el listado de las facturas desde mongo. Se obtuvo: %s registros", invoices.size());

        return invoices;
    }

    public List<InvoiceMsg> getListInvoicesUser(String idClient) {

        LOG.infof("@getListInvoicesUser SERV > Inicia la ejecucion del servicio para obtener el listado de facturas "
                + "del usuario con numero de documento: %s", idClient);

        List<InvoiceMsg> invoices = invoiceRepository.getListInvoicesUser(idClient);

        LOG.infof("@getListInvoicesUser SERV > Finaliza la consulta de facturas en mongo. Se obtuvo: %s registros "
                + "de facturas relacionadas al usuario con numero de documento: %s", invoices.size(), idClient);

        return invoices;
    }

    @CacheInvalidateAll(cacheName = "invoices-list-cache")
    public void updateInvoiceDataMongo(InvoiceMsg invoiceMsg) throws HSException {
        String idInvoice = invoiceMsg.getData().getIdInvoice();
        Invoice invoiceRequest = invoiceMsg.getData();

        LOG.infof("@updateInvoiceDataMongo SERV > Inicia la ejecución del servicio para actualizar el registro de "
                + "la factura con id: %s. Data recibida: %s", idInvoice, invoiceMsg);

        InvoiceMsg invoiceMsgMongo = getInvoiceMsg(idInvoice);
        Invoice invoiceMongo = invoiceMsgMongo.getData();

        // 🔹 Validar usuario existente
        Optional<UserMsg> optionalUser = userRepository.findUserByDocumentNumber(invoiceRequest.getIdClient());
        if (optionalUser.isEmpty()) {
            LOG.warnf("@updateInvoiceDataMongo SERV > No se encontró ningún usuario con documento: %s", invoiceRequest.getIdClient());
            throw new HSException(Response.Status.BAD_REQUEST, "No se encontró el usuario con documento: " + invoiceRequest.getIdClient());
        }

        // 🔹 Validar los ítems (producto o servicio)
        for (ItemInvoice item : invoiceRequest.getItemInvoice()) {
            String idProduct = item.getIdProduct();
            String idService = item.getIdService();

            boolean hasProduct = idProduct != null && !idProduct.isBlank();
            boolean hasService = idService != null && !idService.isBlank();

            if (!hasProduct && !hasService) {
                throw new HSException(Response.Status.BAD_REQUEST,
                        "Cada ítem de la factura debe estar asociado al menos a un producto o un servicio.");
            }

            if (hasProduct && productRepository.findProductById(idProduct).isEmpty()) {
                LOG.warnf("@updateInvoiceDataMongo SERV > No se encontró ningún producto con el id: %s", idProduct);
                throw new HSException(Response.Status.BAD_REQUEST, "No se encontró el producto con id: " + idProduct);
            }

            if (hasService && serviceRepository.findServiceById(idService).isEmpty()) {
                LOG.warnf("@updateInvoiceDataMongo SERV > No se encontró ningún servicio con el id: %s", idService);
                throw new HSException(Response.Status.BAD_REQUEST, "No se encontró el servicio con id: " + idService);
            }
        }

        // 🔹 Validar estado (InvoiceStatus es un enum)
        InvoiceStatus currentStatus = invoiceMongo.getStatus();
        InvoiceStatus newStatus = invoiceRequest.getStatus();

        if (currentStatus == InvoiceStatus.PAGADA && newStatus != InvoiceStatus.PAGADA) {
            LOG.warnf("@updateInvoiceDataMongo SERV > Intento de modificar factura pagada con id: %s", idInvoice);
            throw new HSException(Response.Status.BAD_REQUEST, "No se puede cambiar el estado de una factura pagada.");
        }

        LOG.infof("@updateInvoiceDataMongo SERV > Validaciones completadas correctamente. Inicia actualización de información...");

        setInvoiceInformation(idInvoice, invoiceRequest, invoiceMsgMongo);

        try {
            LOG.infof("@updateInvoiceDataMongo SERV > Inicia actualización en MongoDB de la factura con id: %s", idInvoice);
            invoiceRepository.update(invoiceMsgMongo);
            LOG.infof("@updateInvoiceDataMongo SERV > Actualización completada exitosamente para factura con id: %s", idInvoice);
        } catch (Exception e) {
            LOG.errorf(e, "@updateInvoiceDataMongo SERV > Error al actualizar la factura con id: %s", idInvoice);
            throw new HSException(Response.Status.INTERNAL_SERVER_ERROR, "Error interno al actualizar la factura.");
        }

        LOG.infof("@updateInvoiceDataMongo SERV > Finaliza ejecución del servicio para actualizar factura con id: %s", idInvoice);
    }

    private void setInvoiceInformation(String idInvoice, Invoice invoiceRequest, InvoiceMsg invoiceMsgMongo) {

        LOG.infof("@setInvoiceInformation SERV > Inicia set de los datos de la factura con id: %s", idInvoice);

        Invoice invoiceMongo = invoiceMsgMongo.getData();
        Meta metaMongo = invoiceMsgMongo.getMeta();

        invoiceMongo.setIdClient(invoiceRequest.getIdClient());
        invoiceMongo.setStatus(invoiceRequest.getStatus());
        invoiceMongo.setItemInvoice(invoiceRequest.getItemInvoice());
        invoiceMongo.setTotal(invoiceRequest.getTotal());

        metaMongo.setLastUpdate(LocalDateTime.now());
        metaMongo.setNameUserUpdated(jwtService.getCurrentUserName());
        metaMongo.setEmailUserUpdated(jwtService.getCurrentUserEmail());
        metaMongo.setRoleUserUpdated(jwtService.getCurrentUserRole());

        LOG.infof("@setInvoiceInformation SERV > Finaliza set de los datos de la factura con id: %s", idInvoice);
    }


    @CacheInvalidateAll(cacheName = "invoices-list-cache")
    public void deleteInvoiceDataMongo(String idInvoice) throws HSException {

        LOG.infof("@deleteInvoiceDataMongo SERV > Inicia ejecucion del servicio para eliminar el registro de la "
                + "factura con id: %s", idInvoice);

        long deletedRecords = invoiceRepository.deleteInvoiceDataMongo(idInvoice);

        if (deletedRecords == 0) {

            LOG.errorf("@deleteInvoiceDataMongo SERV > El registro de la factura con id: %s no existe en mongo. No se "
                    + "elimina el registro.", idInvoice);

            throw new HSException(Response.Status.NOT_FOUND, "La factura con id: " + idInvoice + ". No esta registrada en base de datos");
        }

        LOG.infof("@deleteInvoiceDataMongo SERV > Finaliza ejecucion del servicio para eliminar el registro de la factura "
                + "con id: %s. El registro se elimino correctamente.", idInvoice);
    }

    private InvoiceMsg getInvoiceMsg(String idInvoice) throws HSException {

        return invoiceRepository.findInvoiceById(idInvoice).orElseThrow(() -> {

            LOG.errorf("@getInvoiceMsg SERV > La factura con el id: %s No esta registrada. "
                    + "Solicitud invalida no se puede modificar el registro", idInvoice);

            return new HSException(Response.Status.NOT_FOUND, "No se encontro el registro de la factura con "
                    + "id: " + idInvoice + " en la base de datos");
        });
    }
}