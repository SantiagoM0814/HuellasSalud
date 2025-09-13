package org.huellas.salud.domain.product;

import lombok.Getter;

@Getter
public enum CategoryEnum {

    _0_COMIDA("COMIDA"),
    _1_JUGUETES("JUGUETES"),
    _2_MEDICINA("MEDICINA"),
    _3_ACCESORIOS("ACCESORIOS"),
    _4_HIGIENE("HIGIENE"),
    _5_EQUIPOS("EQUIPOS");

    private final String value;

    CategoryEnum(String value) {
        this.value = value;
    }
}
