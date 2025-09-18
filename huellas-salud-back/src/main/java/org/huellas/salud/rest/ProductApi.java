package org.huellas.salud.rest;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.groups.ConvertGroup;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.huellas.salud.domain.product.ProductMsg;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.validators.ValidationGroups;
import org.huellas.salud.services.ProductService;
import org.jboss.logging.Logger;

import java.net.UnknownHostException;
import java.util.List;

@Path("/internal/product")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductApi {

    private static final Logger LOG = Logger.getLogger(ProductApi.class);

    @Inject
    ProductService productService;

    @GET
    @Path("/list-products")
    @Tag(name = "Gestión de productos")
    @Operation(
            summary = "Obtener listado de productos",
            description = "Permite consultar y obtener el listado de los productos registrados"
    )
    public Response getListProducts() {

        LOG.info("@getListProducts API > Inicia servicio de obtener listado de productos");

        List<ProductMsg> products = productService.getListProducts();

        LOG.infof("@getListProducts API > Finaliza consulta de productos. Total elementos: %s", products.size());

        return Response.ok().entity(products).build();
    }

    @POST
    @Path("/register")
    @RolesAllowed("ADMINISTRADOR")
    @Tag(name = "Gestión de productos")
    @Operation(
            summary = "Agregar un nuevo producto",
            description = "Permite crear un nuevo registro de un producto en base de datos"
    )
    public Response addProduct(
            @RequestBody(
                    name = "productMsg",
                    description = "Información del producto a registrar",
                    required = true,
                    content = @Content(example = """
                            {
                                "data": {
                                    "name": "Agility Gold Gatos Sin Granos 7 Kg",
                                    "category": "Comida",
                                    "description": "Alimento ideal para suministrar en todas las etapas de la vida de los gatos",
                                    "animalType": "PERRO",
                                    "price": 170000,
                                    "unitOfMeasure": "Unidad",
                                    "quantityAvailable": 10,
                                    "brand": "Agility Gold",
                                    "expirationDate": "2026-11-13",
                                    "barcode": "910000009"
                                }
                            }""")
            )
            @NotNull(message = "Debe ingresar el objeto con la información del producto a registrar")
            @Valid @ConvertGroup(to = ValidationGroups.Post.class) ProductMsg productMsg
    ) throws HSException, UnknownHostException {

        LOG.info("@addProduct API > Inicia ejecucion del servicio para agregar un producto nuevo");

        ProductMsg productCreated = productService.addProductInMongo(productMsg);

        LOG.debug("@addProduct API > Finaliza la ejecucion del servicio para registrar un producto nuevo");

        return Response.ok()
                .status(Response.Status.CREATED)
                .entity(productCreated)
                .build();
    }

    @PUT
    @Path("/update")
    @Tag(name = "Gestión de productos")
    public Response updateProductData(
            @RequestBody(
                    name = "productMsg",
                    description = "Información con la que se actualizara el producto",
                    required = true
            )
            @NotNull(message = "Debe ingresar los datos que se actualizarán del producto")
            @ConvertGroup(to = ValidationGroups.Put.class) @Valid ProductMsg productMsg
    ) throws HSException {

        LOG.debugf("@updateProductData API > Inicia ejecucion del servicio para actualizar la informacion de un " +
                "producto con la data: %s", productMsg.getData());

        productService.updateProductDataInMongo(productMsg);
        ProductMsg productUpdated = productService.getProductById(productMsg.getData().getIdProduct());

        LOG.debugf("@updateProductData API > Finaliza ejecucion del servicio de actualizacion de la informacion de " +
                "un producto. Se actualizo con la siguiente informacion: %s", productMsg);

        return Response.ok(productUpdated)
                .build();
    }
}
