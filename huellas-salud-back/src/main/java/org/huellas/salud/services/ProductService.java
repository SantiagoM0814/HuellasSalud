package org.huellas.salud.services;

import io.quarkus.cache.CacheInvalidateAll;
import io.quarkus.cache.CacheResult;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.huellas.salud.domain.product.Product;
import org.huellas.salud.domain.product.ProductMsg;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.utils.Utils;
import org.huellas.salud.repositories.ProductRepository;
import org.jboss.logging.Logger;

import java.net.UnknownHostException;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ProductService {

    private static final Logger LOG = Logger.getLogger(ProductService.class);

    @Inject
    Utils utils;

    @Inject
    ProductRepository productRepository;

    @CacheResult(cacheName = "products-list-cache")
    public List<ProductMsg> getListProducts() {

        LOG.info("@getListProducts SERV > Inicia servicio para obtener listado de productos registrados en mongo");

        List<ProductMsg> products = productRepository.listAll(Sort.descending("data.name"));

        LOG.infof("@getListProducts SERV > Finaliza consulta. Se obtuvo: %s productos", products.size());

        return products;
    }

    @CacheInvalidateAll(cacheName = "products-list-cache")
    public void addProductInMongo(ProductMsg productMsg) throws HSException, UnknownHostException {

        LOG.infof("@addProductInMongo SERV > Inicia servicio para agregar producto con la data: %s.", productMsg);

        validateIfProductIsRegistered(productMsg);

        Product product = productMsg.getData();

        product.setIdProduct(UUID.randomUUID().toString());
        product.setActive(product.getQuantityAvailable() > 0);
        product.setBrand(utils.capitalizeWords(product.getBrand()));
        product.setName(utils.capitalizeWords(product.getName()));
        product.setDescription(utils.capitalizeWords(product.getDescription()));

        productMsg.setMeta(utils.getMetaToEntity());

        LOG.infof("@addProductInMongo SERV > Inicia guardado del producto: %s en mongo", productMsg);

        productRepository.persist(productMsg);

        LOG.infof("@addProductInMongo SERV > El producto se registro correctamente con ID: %s.", product.getIdProduct());
    }

    private void validateIfProductIsRegistered(ProductMsg productMsg) throws HSException {

        LOG.info("@validateIfProductIsRegistered SERV > Inicia validacion de existencia del producto en mongo");

        if (productRepository.getProductByBarCode(productMsg.getData().getBarcode()).isPresent()) {

            LOG.errorf("@validateIfProductIsRegistered SERV > El producto con la data: %s ya existe en la " +
                    "base de datos. No se realiza registro del producto", productMsg);

            throw new HSException(Response.Status.BAD_REQUEST, "El producto con el código de barras: " + productMsg
                    .getData().getBarcode() + " ya se encuentra registrado en la base de datos");
        }
        ;

        LOG.info("@validateIfProductIsRegistered SERV > El producto no se encuentra registrado");
    }
}
