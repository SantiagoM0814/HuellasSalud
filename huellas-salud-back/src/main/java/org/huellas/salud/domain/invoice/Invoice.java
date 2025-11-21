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
    @Schema(example = "1805b3a6-2994-4376-b712-27d3ae23ab5e")
    @Null(message = "No debe enviar ningún valor en el campo idInvoice", groups = ValidationGroups.Post.class)
    private String idInvoice;

    @BsonProperty("fecha")
    private LocalDateTime date;

    @BsonProperty("idCliente")
    @Schema(example = "1020657534")
    @NotBlank(message = "Debe asociar un cliente")
    private String idClient;

    @BsonProperty("total")
    @Schema(example = "50000")
    private Double total;

    @BsonProperty("tipoFactura")
    @Schema(example = "PRODUCTO")
    @NotBlank(message = "Debe inlcuir e tipo de factura")
    private String typeInvoice;

    @BsonProperty("estado")
    @Schema(example = "PAGADA")
    @NotNull(message = "El estado en obligatorio")
    private InvoiceStatus status;

    @BsonProperty("itemFactura")
    @NotEmpty(message = "Debe incluir al menos un ítem en la factura")
    private List<ItemInvoice> itemInvoice;
} 