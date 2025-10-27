package org.huellas.salud.domain.invoice;

import lombok.Data;
import jakarta.validation.constraints.*;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Data
public class ItemInvoice {

    @BsonProperty("idProducto")
    @Schema(example = "8b86d3bf-b1dd-482c-8fcf-042fb98bc60b")
    private String idProduct;

    @BsonProperty("idServicio")
    @Schema(example = "5781b155-6a02-4cef-92e4-bf697f82e7f1")
    private String idService;

    @BsonProperty("idMascota")
    @Schema(example = "4c5a9d28-9f8e-4e47-9c2f-bf1d8a81234b",
            description = "Solo se usa si el ítem corresponde a un servicio que depende del peso de la mascota")
    private String idPet;

    @BsonProperty("cantidad")
    @Schema(example = "2")
    private Integer quantity;

    @BsonProperty("precioUnitario")
    @Schema(example = "25000")
    @NotNull(message = "El precio unitario es obligatorio")
    private Double unitPrice;

    @BsonProperty("subTotal")
    @Schema(example = "50000")
    @NotNull(message = "El subTotal es obligatorio")
    private Double subTotal;
}