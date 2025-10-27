package org.huellas.salud.repositories;

import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.huellas.salud.domain.invoice.InvoiceMsg;
import io.quarkus.panache.common.Sort;
import org.jboss.logging.Logger;
import java.util.Optional;
import java.util.List;

@ApplicationScoped
public class InvoiceRepository implements PanacheMongoRepository<InvoiceMsg> {

    private static final Logger LOG = Logger.getLogger(InvoiceRepository.class);

    public Optional<InvoiceMsg> findInvoiceById(String idInvoice) {

        LOG.infof("@findInvoiceById REPO > Inicia busqueda del registro de la factura con id: %s", idInvoice);

        return find("data.idFactura = ?1", idInvoice).firstResultOptional();
    }

    public List<InvoiceMsg> getListInvoicesUser(String userDocument) {

        LOG.infof("@getListInvoicesUser REPO > Inicia busqueda de las facturas relacionadas con"
                + " el usuario con numero de documento: %s", userDocument);

        return list("data.idCliente = ?1", userDocument);
    }

    public List<InvoiceMsg> getListInvoicesMongo() {

        LOG.infof("@getListInvoiceMongo REPO > Inicia la obtencion del listado de facturas registradas "
                + "en mongo");

        return listAll(Sort.descending("meta.fechaCreacion"));
    }

    public long deleteInvoiceDataMongo(String idInvoice) {

        LOG.infof("@deleteInvoiceDataMongo REPO > Inicia eliminacion del registro de la factura con id: %s", idInvoice);

        return delete("data.idFactura = ?1", idInvoice);
    }
}