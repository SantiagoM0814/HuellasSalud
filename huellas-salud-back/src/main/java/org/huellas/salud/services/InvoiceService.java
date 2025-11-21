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
import org.huellas.salud.services.ProductService;
import org.huellas.salud.services.AppointmentService;

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

    @Inject
    ProductService productService;

    @Inject
    AppointmentService appointmentService;

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

        double totalFactura = 0;
        for (ItemInvoice item : invoiceData.getItemInvoice()) {
            double precioUnitario;
            double subtotal;

            String idProduct = item.getIdProduct();
            String idService = item.getIdService();

            boolean hasProduct = idProduct != null && !idProduct.isBlank();
            boolean hasService = idService != null && !idService.isBlank();

            if (!hasProduct && !hasService) {
                throw new HSException(Response.Status.BAD_REQUEST,
                        "Cada ítem de la factura debe estar asociado al menos a un producto o un servicio.");
            }

            if (hasProduct) {

                ProductMsg productMsg = productService.getProductById(idProduct);
                if (productMsg == null) {
                    throw new HSException(Response.Status.BAD_REQUEST, "No se encontró el producto con id: " + idProduct);
                }
                if (productMsg.getData().getActive() == null || !productMsg.getData().getActive()) {
                    throw new HSException(Response.Status.BAD_REQUEST,
                            "El producto con id " + idProduct + " no está activo");
                }

                precioUnitario = productMsg.getData().getPrice();
                item.setUnitPrice(precioUnitario);
                item.setSubTotal(precioUnitario * item.getQuantity());
                totalFactura += item.getSubTotal();

                int stockActual = productMsg.getData().getQuantityAvailable();
                int cantidadComprada = item.getQuantity();

                if (stockActual < cantidadComprada) {
                    throw new HSException(Response.Status.BAD_REQUEST,
                            "No hay suficiente stock del producto: " + productMsg.getData().getName());
                }

                int nuevoStock = stockActual - cantidadComprada;
                productMsg.getData().setQuantityAvailable(nuevoStock);

                productService.updateProductDataInMongo(productMsg);

                LOG.infof("@saveInvoiceDataMongo SERV > Stock actualizado para producto %s: %d → %d",
                        productMsg.getData().getName(), stockActual, nuevoStock);
            }

            if (hasService) {
                Optional<ServiceMsg> optionalService = serviceRepository.findServiceById(idService);
                if (item.getIdPet() == null || item.getIdPet().isBlank()) {
                    throw new HSException(Response.Status.BAD_REQUEST,
                            "Debe especificar idPet para calcular el precio del servicio.");
                }

                if (optionalService.isEmpty()) {
                    LOG.warnf("@saveInvoiceDataMongo SERV > No se encontró ningún servicio con el id: %s", idService);
                    throw new HSException(Response.Status.BAD_REQUEST,
                            "No se encontró el servicio con id: " + idService);
                }

                double price = appointmentService.calculateTotal(item.getIdPet(), List.of(item.getIdService()));
                item.setUnitPrice(price);
                item.setSubTotal(price);
                totalFactura += price;
            }
        }

        LOG.infof("@saveInvoiceDataMongo SERV > Inicia formato de la info enviada y se agrega metadata");

        invoiceData.setIdInvoice(UUID.randomUUID().toString());
        invoiceData.setDate(LocalDateTime.now());
        invoiceData.setTotal(totalFactura);
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

        LOG.infof("@updateInvoiceDataMongo SERV > Inicia la ejecución del servicio para actualizar la factura %s", idInvoice);

        // Obtener factura original
        InvoiceMsg invoiceMsgMongo = getInvoiceMsg(idInvoice);
        Invoice invoiceMongo = invoiceMsgMongo.getData();

        // Validar cliente
        Optional<UserMsg> optionalUser = userRepository.findUserByDocumentNumber(invoiceRequest.getIdClient());
        if (optionalUser.isEmpty()) {
            throw new HSException(Response.Status.BAD_REQUEST,
                    "No se encontró el usuario con documento: " + invoiceRequest.getIdClient());
        }

        double totalFactura = 0.0;

        // Validar y recalcular items
        for (ItemInvoice item : invoiceRequest.getItemInvoice()) {

            String idProduct = item.getIdProduct();
            String idService = item.getIdService();

            boolean hasProduct = idProduct != null && !idProduct.isBlank();
            boolean hasService = idService != null && !idService.isBlank();

            if (!hasProduct && !hasService) {
                throw new HSException(Response.Status.BAD_REQUEST,
                        "Cada ítem de la factura debe estar asociado al menos a un producto o un servicio.");
            }

            if (hasProduct) {

                ProductMsg productMsg = productService.getProductById(idProduct);
                if (productMsg == null) {
                    throw new HSException(Response.Status.BAD_REQUEST,
                            "No se encontró el producto con id: " + idProduct);
                }
                if (productMsg.getData().getActive() == null || !productMsg.getData().getActive()) {
                    throw new HSException(Response.Status.BAD_REQUEST,
                            "El producto con id " + idProduct + " no está activo");
                }

                double precioUnitario = productMsg.getData().getPrice();
                double subtotal = precioUnitario * item.getQuantity();

                item.setUnitPrice(precioUnitario);
                item.setSubTotal(subtotal);

                totalFactura += subtotal;

                int stockActual = productMsg.getData().getQuantityAvailable();
                int cantidadComprada = item.getQuantity();

                if (stockActual < cantidadComprada) {
                    throw new HSException(Response.Status.BAD_REQUEST,
                            "No hay suficiente stock del producto: " + productMsg.getData().getName());
                }

                int nuevoStock = stockActual - cantidadComprada;
                productMsg.getData().setQuantityAvailable(nuevoStock);

                productService.updateProductDataInMongo(productMsg);

                LOG.infof("@saveInvoiceDataMongo SERV > Stock actualizado para producto %s: %d → %d",
                        productMsg.getData().getName(), stockActual, nuevoStock);
            }

            if (hasService) {

                if (item.getIdPet() == null || item.getIdPet().isBlank()) {
                    throw new HSException(Response.Status.BAD_REQUEST,
                            "Debe especificar idPet para calcular el precio del servicio.");
                }

                // Recalcular precio con reglas de peso
                double precioServicio = appointmentService.calculateTotal(item.getIdPet(), List.of(item.getIdService()));

                item.setUnitPrice(precioServicio);
                item.setSubTotal(precioServicio);

                totalFactura += precioServicio;

                // Validar existencia del servicio
                if (serviceRepository.findServiceById(idService).isEmpty()) {
                    throw new HSException(Response.Status.BAD_REQUEST,
                            "No se encontró el servicio con id: " + idService);
                }
            }
        }

        // Validar estado
        if (invoiceMongo.getStatus() == InvoiceStatus.PAGADA
                && invoiceRequest.getStatus() != InvoiceStatus.PAGADA) {
            throw new HSException(Response.Status.BAD_REQUEST,
                    "No se puede cambiar el estado de una factura pagada.");
        }

        // Actualizar la factura en el objeto original
        invoiceMongo.setItemInvoice(invoiceRequest.getItemInvoice());
        invoiceMongo.setIdClient(invoiceRequest.getIdClient());
        invoiceMongo.setTypeInvoice(invoiceRequest.getTypeInvoice());
        invoiceMongo.setStatus(invoiceRequest.getStatus());
        invoiceMongo.setTotal(totalFactura);

        invoiceMsgMongo.setData(invoiceMongo);

        // Guardar en Mongo
        try {
            invoiceRepository.update(invoiceMsgMongo);
        } catch (Exception e) {
            throw new HSException(Response.Status.INTERNAL_SERVER_ERROR,
                    "Error interno al actualizar la factura.");
        }

        LOG.infof("@updateInvoiceDataMongo SERV > Finaliza ejecución del servicio para actualizar factura con id: %s", idInvoice);
    }

    private void setInvoiceInformation(String idInvoice, Invoice invoiceRequest, InvoiceMsg invoiceMsgMongo) {

        LOG.infof("@setInvoiceInformation SERV > Inicia set de los datos de la factura con id: %s", idInvoice);

        Invoice invoiceMongo = invoiceMsgMongo.getData();
        Meta metaMongo = invoiceMsgMongo.getMeta();

        invoiceMongo.setIdClient(invoiceRequest.getIdClient());
        invoiceMongo.setStatus(invoiceRequest.getStatus());
        invoiceMongo.setTypeInvoice(invoiceRequest.getTypeInvoice());
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
