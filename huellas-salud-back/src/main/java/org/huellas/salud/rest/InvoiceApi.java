package org.huellas.salud.rest;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.huellas.salud.domain.invoice.InvoiceMsg;
import org.huellas.salud.domain.invoice.Invoice;
import org.huellas.salud.services.InvoiceService;
import jakarta.validation.constraints.NotBlank;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.huellas.salud.helper.exceptions.HSException;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import jakarta.ws.rs.core.MediaType;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;
import jakarta.ws.rs.*;
import org.huellas.salud.helper.validators.ValidationGroups;
import jakarta.validation.groups.ConvertGroup;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;

import java.net.UnknownHostException;
import java.util.List;
import java.time.LocalDate;
import java.util.Collections;

@Path("/internal/invoice")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class InvoiceApi {

    private static final Logger LOG = Logger.getLogger(InvoiceApi.class);

    @Inject
    InvoiceService invoiceService;

    @GET
    @Path("/list-invoices")
    @RolesAllowed("ADMINISTRADOR")
    @Tag(name = "Gestión de facturas")
    @APIResponses(
            value = {
                @APIResponse(
                        responseCode = "200",
                        description = "Se retorna el listado de las facturas registradas correctamente",
                        content = @Content(schema = @Schema(implementation = InvoiceMsg.class, type = SchemaType.ARRAY))
                )
            }
    )
    @Operation(
            summary = "Obtención de todas las facturas registradas",
            description = "Permite obtener un listado con la información de las facturas registradas en la base de datos"
    )
    public Response getListInvoices() {

        LOG.infof("@getListInvoices API > Inicia servicio para obtener listado de todas las facturas registradas en mongo");

        List<InvoiceMsg> invoices = invoiceService.getListInvoiceMsg();

        LOG.infof("@getListInvoices API > Finaliza servicio para obtener el listado de todas las facturas "
                + "registadas. Se encontraron: %s registros", invoices.size());

        return Response.ok().entity(invoices).build();
    }

    @GET
    @Path("/list-invoices-client/{idClient}")
    @RolesAllowed({"ADMINISTRADOR", "CLIENTE"})
    @Tag(name = "Gestión de facturas")
    @APIResponses(
            value = {
                @APIResponse(
                        responseCode = "200",
                        description = "Se retorna el listado de las facturas del usuario correctamente",
                        content = @Content(schema = @Schema(implementation = InvoiceMsg.class, type = SchemaType.ARRAY))
                ),
                @APIResponse(
                        responseCode = "404",
                        description = "No se encontraron facturas para el usuario indicado"
                )
            }
    )
    @Operation(
            summary = "Obtención de facturas de un usuario",
            description = "Permite obtener el listado de las facturas registradas asociadas a un usuario específico según su número de documento"
    )
    public Response getListInvoicesUser(@PathParam("idClient") String idClient) {

        LOG.infof("@getListInvoicesUser API > Inicia servicio para obtener el listado de facturas del usuario con documento: %s", idClient);

        List<InvoiceMsg> invoices = invoiceService.getListInvoicesUser(idClient);

        LOG.infof("@getListInvoicesUser API > Finaliza servicio. Se encontraron %s facturas para el usuario con documento: %s", invoices.size(), idClient);

        return Response.ok().entity(invoices).build();
    }

    @POST
    @Path("/create")
    @RolesAllowed({"ADMINISTRADOR", "CLIENTE", "VETERINARIO"})
    @Tag(name = "Gestión de facturas")
    @Operation(
            summary = "Creación de una factura nueva",
            description = """
                Permite crear el registro de una factura nueva en la base de datos. 

                Cada itemInvoice debe representar únicamente un producto o un servicio:

                • Ítem de PRODUCTO:
                - Se debe enviar: idProduct, quantity
                - No se debe enviar: idService, idPet

                • Ítem de SERVICIO:
                - Se debe enviar: idService, idPet
                - No se debe enviar: idProduct, quantity

                El sistema calculará automáticamente el precio unitario, subtotal y total 
                a partir de la información almacenada en la base de datos.
                """
    )
    public Response createInvoiceData(
            @RequestBody(
                    name = "invoiceMsg",
                    description = "Objeto con la información de la factura que se va a crear",
                    required = true,
                    content = @Content(example = """
                        {
                                "data": {
                                        "idClient": "1020657897",
                                        "typeInvoice": "PRODUCTO",
                                        "status": "PAGADA",
                                        "itemInvoice": [
                                                {
                                                        "idProduct": "e5578a34-c1e6-41f7-a5f2-a24e53e79f26",
                                                        "idService": "a1b46745-d7c3-44ab-85f7-b751586f8164",
                                                        "idPet": "59c9fb42-71af-49ec-ae07-66982a58a3a3",
                                                        "quantity": 2
                                                }
                                        ]
                                }
                        }"""
                    )
            )
            @NotNull(message = "Debe ingresar el objeto data con la informacion de la factura a registrar")
            @Valid @ConvertGroup(to = ValidationGroups.Post.class) InvoiceMsg invoiceMsg
    ) throws UnknownHostException, HSException {

        LOG.infof("@createInvoiceData API > Inicia ejecucion del servicio para crear el registro de una factura "
                + "en base de datos con la data: %s", invoiceMsg.getData());

        InvoiceMsg invoiceCreated = invoiceService.saveInvoiceDataMongo(invoiceMsg);

        LOG.infof("@createInvoiceData API > Finaliza ejecucion del servicio para crear el registro de una factura "
                + "en base de datos. Se registro la siguiente informacion: %s", invoiceMsg);

        return Response.status(Response.Status.CREATED)
                .entity(invoiceCreated)
                .build();
    }

    @PUT
    @Path("/update")
    @RolesAllowed("ADMINISTRADOR")
    @Tag(name = "Gestión de facturas")
    @Operation(
            summary = "Actualización de la información de una factura",
            description = """
                Permite actualizar la información de una factura registrada en la base de datos 

                Cada itemInvoice debe representar únicamente un producto o un servicio:

                • Ítem de PRODUCTO:
                - Se debe enviar: idProduct, quantity
                - No se debe enviar: idService, idPet

                • Ítem de SERVICIO:
                - Se debe enviar: idService, idPet
                - No se debe enviar: idProduct, quantity

                El sistema calculará automáticamente el precio unitario, subtotal y total 
                a partir de la información almacenada en la base de datos.
                """
    )
    public Response updateInvoiceData(
            @RequestBody(
                    name = "facturaMsg",
                    description = "Información con la que se actualizara la factura",
                    required = true,
                    content = @Content(example = """
                        {
                                "data": {
                                        "idInvoice": "bb24d89f-24a4-4cbc-a129-882a2174a795",
                                        "idClient": "1020657897",
                                        "typeInvoice": "SERVICIO",
                                        "status": "PENDIENTE",
                                        "itemInvoice": [
                                                {
                                                        "idProduct": "e5578a34-c1e6-41f7-a5f2-a24e53e79f26",
                                                        "idService": "a1b46745-d7c3-44ab-85f7-b751586f8164",
                                                        "idPet": "59c9fb42-71af-49ec-ae07-66982a58a3a3",
                                                        "quantity": 2
                                                }
                                        ]
                                }
                        }"""
                    )
            )
            @NotNull(message = "Debe ingresar los datos de la factura a actualizar")
            @ConvertGroup(to = ValidationGroups.Put.class) @Valid InvoiceMsg invoiceMsg
    ) throws HSException {

        LOG.infof("@updateInvoiceData API > Inicia ejecucion del servicio para actualiazr el registro de una factura "
                + "en la base de datos con la data: %s", invoiceMsg);

        invoiceService.updateInvoiceDataMongo(invoiceMsg);
        InvoiceMsg invoiceUpdated = invoiceService.getInvoiceById(invoiceMsg.getData().getIdInvoice());

        LOG.debugf("@updateInvoiceData API > Finaliza ejecucion del servicio para actualizar el registro de una factura "
                + "en base de datos con la informacion: %s", invoiceMsg);

        return Response.ok(invoiceUpdated)
                .build();
    }

    @DELETE
    @Path("/delete")
    @RolesAllowed("ADMINISTRADOR")
    @Tag(name = "Gestión de facturas")
    @Operation(
            summary = "Eliminación de una factura",
            description = "Permite eliminar el registro de una factura en la base de datos"
    )
    public Response deleteInvoiceData(
            @Parameter(
                    name = "idInvoice",
                    description = "Identificador de la factura a eliminar",
                    required = true,
                    example = "faf32d41-65b2-431b-a468-0dbc6650ae47"
            )
            @NotBlank(message = "Debe ingresar el identificador (idInvoice) de la factura a eliminar")
            @QueryParam("idInvoice") String idInvoice
    ) throws HSException {

        LOG.infof("@deleteInvoiceData API > Inicia ejecucion del servicio para eliminar el registro de una factura "
                + "en la base de datos con id: %s", idInvoice);

        invoiceService.deleteInvoiceDataMongo(idInvoice);

        LOG.infof("@deleteInvoiceData API > Finaliza ejecucion del servicio para eliminar el registro de una factura "
                + "en la base de datos con id: %s", idInvoice);

        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
