package org.huellas.salud.domain.product;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.huellas.salud.helper.validators.ValidationGroups;
import org.huellas.salud.domain.mediaFile.MediaFile;

import java.io.Serializable;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product implements Serializable {

    @BsonProperty("idProducto")
    @Schema(example = "6785666d-a30b-4bac-beae-95e2ca308931")
    @Null(message = "No debe ingresar el valor del campo idProduct", groups = ValidationGroups.Post.class)
    private String idProduct;

    @BsonProperty("nombre")
    @Schema(example = "Comida Perro Purina")
    @NotBlank(message = "El campo name no puede ser nulo o vacío")
    @Size(min = 3, max = 40, message = "El campo name debe contener entre 3 y 40 caracteres")
    private String name;

    @BsonProperty("categoria")
    @Schema(example = "Comida")
    @NotBlank(message = "El valor del campo category no puede ser nulo o vacío")
    private String category;

    @BsonProperty("descripcion")
    @Schema(example = "Dog Chow Alta Proteína para perros Adultos 7.5 Kg")
    @NotBlank(message = "El valor del campo description no puede ser nulo o vacío")
    @Size(min = 10, max = 200, message = "El campo description debe contener entre 10 y 200 caracteres")
    private String description;

    @BsonProperty("precio")
    @Schema(example = "57000")
    @NotNull(message = "El valor del campo price no debe ser nulo")
    @Positive(message = "El valor del campo precio debe ser mayor a 0")
    private Double price;

    @BsonProperty("unidadMedida")
    @Schema(example = "Unidad")
    @NotBlank(message = "El valor del campo unitOfMeasure no puede ser nulo o vacío")
    private String unitOfMeasure;

    @BsonProperty("cantidadDisponible")
    @Schema(example = "25")
    @NotNull(message = "El valor del campo quantityAvailable No debe ser nulo")
    @Positive(message = "El campo quantityAvailable debe contener valores positivos (mayor a 0)")
    private Integer quantityAvailable;

    @BsonProperty("marca")
    @Schema(example = "Purina Pro Plan")
    @NotBlank(message = "El valor del campo brand no puede ser nulo o vacío")
    @Size(min = 4, max = 60, message = "El campo brand debe contener entre 4 y 60 caracteres")
    private String brand;

    @BsonProperty("fechaVencimiento")
    @Schema(example = "2025-02-27")
    @NotNull(message = "El valor del campo expirationDate no puede ser nulo")
    private LocalDate expirationDate;

    @BsonProperty("codigoBarras")
    @Schema(example = "8412345678905")
    @NotBlank(message = "El valor del campo barcode no puede ser nulo o vacío")
    @Size(min = 6, max = 20, message = "El campo barcode debe contener entre 6 y 20 caracteres")
    private String barcode;

    @BsonProperty("activo")
    private Boolean active;

    private MediaFile mediaFile;
}
