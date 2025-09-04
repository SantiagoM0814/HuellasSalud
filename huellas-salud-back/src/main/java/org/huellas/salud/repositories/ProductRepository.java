package org.huellas.salud.repositories;

import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.huellas.salud.domain.product.ProductMsg;
import org.jboss.logging.Logger;

import java.util.Optional;

@ApplicationScoped
public class ProductRepository implements PanacheMongoRepository<ProductMsg> {

    private static final Logger LOG = Logger.getLogger(ProductRepository.class);

    public Optional<ProductMsg> getProductByBarCode(String barCode) {

        LOG.debugf("@getProductByBarCode REPO > Inicia busqueda del registro del producto en mongo con el " +
                "numero de codigo de barras: %s", barCode);

        return find("data.codigoBarras = ?1", barCode).firstResultOptional();
    }

}
