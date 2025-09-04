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

        productService.addProductInMongo(productMsg);

        LOG.debug("@addProduct API > Finaliza la ejecucion del servicio para registrar un producto nuevo");

        return Response.status(Response.Status.CREATED).build();
    }
}
