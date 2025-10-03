package org.huellas.salud.services;

import io.quarkus.cache.CacheInvalidateAll;
import io.quarkus.cache.CacheResult;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.huellas.salud.domain.Meta;
import org.huellas.salud.domain.product.Product;
import org.huellas.salud.domain.product.ProductMsg;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.jwt.JwtService;
import org.huellas.salud.helper.utils.Utils;
import org.huellas.salud.repositories.MediaFileRepository;
import org.huellas.salud.repositories.ProductRepository;
import org.jboss.logging.Logger;

import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@ApplicationScoped
public class ProductService {

    private static final Logger LOG = Logger.getLogger(ProductService.class);

    @Inject
    Utils utils;

    @Inject
    JwtService jwtService;

    @Inject
    ProductRepository productRepository;

    @Inject
    MediaFileRepository mediaFileRepository;

    @CacheResult(cacheName = "products-list-cache")
    public List<ProductMsg> getListProducts() {

        LOG.info("@getListProducts SERV > Inicia servicio para obtener listado de productos registrados en mongo");

        List<ProductMsg> products = productRepository.listAll(Sort.descending("data.name"));

        products.forEach(productMsg -> {
            mediaFileRepository.getMediaByEntityTypeAndId("PRODUCT", productMsg.getData().getIdProduct())
                    .ifPresent(media -> productMsg.getData().setMediaFile(media.getData()));
        });

        LOG.infof("@getListProducts SERV > Finaliza consulta. Se obtuvo: %s productos", products.size());

        return products;
    }

    public ProductMsg getProductById(String idProduct) {
        LOG.infof("@getProductById SERV > Inicia ejecucion del servicio para obtener el producto con id: " +
                " %s. Inicia consulta a mongo", idProduct);

        Optional<ProductMsg> optionalProduct = productRepository.findProductById(idProduct);

        if (optionalProduct.isEmpty()) {
            LOG.warnf("@getProductById SERV > No se encontro ningun producto con el id: %s", idProduct);
            return null;
        }

        ProductMsg product = optionalProduct.get();

        mediaFileRepository.getMediaByEntityTypeAndId("PRODUCT", product.getData().getIdProduct())
                .ifPresent(media -> product.getData().setMediaFile(media.getData()));

        LOG.infof("@getProductById SERV > Finaliza consulta de producto en mongo. Se obtuvo el registro " +
                "del producto con id: %s", idProduct);

        return product;
    }

    @CacheInvalidateAll(cacheName = "products-list-cache")
    public ProductMsg addProductInMongo(ProductMsg productMsg) throws HSException, UnknownHostException {

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

        return productMsg;
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

    @CacheInvalidateAll(cacheName = "products-list-cache")
    public void updateProductDataInMongo(ProductMsg productMsg) throws HSException {
        LOG.infof("@updateProductDataInMongo SERV > Inicia ejecucion del servicio para actualizar registro del producto " +
                "con el id: %s. Data a modificar: %s", productMsg.getData().getIdProduct(), productMsg);

        ProductMsg productMsgMongo = getProductMsg(productMsg.getData().getIdProduct());

        LOG.infof("@updateProductDataInMongo SERV > El producto con id: %s si esta registrado. Inicia la " +
                "actualizacion del registro del producto con data: %s", productMsg.getData().getIdProduct(), productMsg);

        setProductInformation(productMsg.getData().getIdProduct(), productMsg.getData(), productMsgMongo);

        LOG.infof("@updateProductDataInMongo SERV > Finaliza edicion de la informacion del producto con id: %s. " +
                "Inicia actualizacion en mongo con la data: %s", productMsg.getData().getIdProduct(), productMsg);

        productRepository.update(productMsgMongo);

        LOG.infof("@updateProductDataInMongo SERV > Finaliza actualizacion del registro del producto con id: %s. " +
                "Finaliza ejecucion de servicio de actualizacion", productMsg.getData().getIdProduct());
    }

    private void setProductInformation(String idProduct, Product productRequest, ProductMsg productMsgMongo) {

        LOG.infof("@setProductInformation SERV > Inicia set de los datos del producto con id: %s", idProduct);

        Product productMongo = productMsgMongo.getData();
        Meta metaMongo = productMsgMongo.getMeta();

        productMongo.setName(utils.capitalizeWords(productRequest.getName()));
        productMongo.setCategory(productRequest.getCategory());
        productMongo.setAnimalType(productRequest.getAnimalType());
        productMongo.setDescription(productRequest.getDescription());
        productMongo.setPrice(productRequest.getPrice());
        productMongo.setUnitOfMeasure(productRequest.getUnitOfMeasure());
        productMongo.setQuantityAvailable(productRequest.getQuantityAvailable());
        productMongo.setBrand(productRequest.getBrand());
        productMongo.setExpirationDate(productRequest.getExpirationDate());
        productMongo.setBarcode(productRequest.getBarcode());
        productMongo.setActive(productRequest.getActive());


        metaMongo.setLastUpdate(LocalDateTime.now());
        metaMongo.setNameUserUpdated(jwtService.getCurrentUserName());
        metaMongo.setEmailUserUpdated(jwtService.getCurrentUserEmail());
        metaMongo.setRoleUserUpdated(jwtService.getCurrentUserRole());

        LOG.infof("@setProductInformation SERV > Finaliza set de los datos del producto con id: %s", idProduct);
    }

    private ProductMsg getProductMsg(String idProduct) throws HSException {
        return productRepository.findProductById(idProduct).orElseThrow(() -> {
            LOG.errorf("@updateProductDataInMongo SERV > El producto con el identificador: %s NO esta registrado" +
                    ". Solicitud invalida no se puede modificar el registro", idProduct);

            return new HSException(Response.Status.NOT_FOUND, "No se encontro el registro del producto con " +
                    "identificador: " + idProduct + "en la base de datos");
        });
    }
}
