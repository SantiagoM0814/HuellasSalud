package org.huellas.salud.domain.invoice;


import jakarta.validation.constraints.*;

import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.huellas.salud.helper.validators.ValidationGroups;
import org.bson.codecs.pojo.annotations.BsonProperty;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice implements Serializable {

    @BsonProperty("idFactura")
    @Schema(example = "")
    @Null(message = "No debe enviar ningún valor en el campo idInvoice", groups = ValidationGroups.Post.class)
    private String idInvoice;

    @BsonProperty("fecha")
    @NotNull(message = "La fecha es obligatoria")
    private LocalDateTime date;

    @BsonProperty("idCliente")
    @NotBlank(message = "Debe asociar un cliente")
    private String idClient;

    @BsonProperty("total")
    @NotNull(message = "Debe incluir el total de la factura")
    private Double total;

    @BsonProperty("tipoFactura")
    @Schema(example = "PRODUCTO")
    @NotBlank(message = "Debe inlcuir e tipo de factura")
    private String typeInvoice;

    @BsonProperty("estado")
    @Schema(example = "PAGADA")
    private InvoiceStatus status;

    @BsonProperty("itemFactura")
    @NotEmpty(message = "Debe incluir al menos un ítem en la factura")
    private List<ItemInvoice> itemInvoice;
}