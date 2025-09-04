package org.huellas.salud.domain.product;

import lombok.Getter;

@Getter
public enum CategoryEnum {

    _0_COMIDA("Comida"),
    _1_JUGUETES("Juguetes"),
    _2_MEDICINA("Medicina"),
    _3_ACCESORIOS("Accesorios"),
    _4_HIGIENE("Higiene"),
    _5_EQUIPOS("Equipos");

    private final String value;

    CategoryEnum(String value) {
        this.value = value;
    }
}
