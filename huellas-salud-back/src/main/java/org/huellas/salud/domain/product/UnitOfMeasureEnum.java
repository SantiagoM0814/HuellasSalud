package org.huellas.salud.domain.product;

import lombok.Getter;

@Getter
public enum UnitOfMeasureEnum {

    _0_UNIDAD("Unidad"),
    _1_PAQUETE("Paquete"),
    _2_CAJA("Caja"),
    _3_GRAMO("g"),
    _4_KILOGRAMO("kg"),
    _5_MILILITRO("ml"),
    _6_LITRO("l"),
    _7_TABLETA("Tableta"),
    _8_CAPSULA("Cápsula"),
    _9_FRASCO("Frasco"),
    _10_AMPOLLA("Ampolla"),
    _11_TIRA("Tira"),
    _12_BLISTER("Blíster"),
    _13_SOBRE("Sobre"),
    _14_BOTELLA("Botella"),
    _15_TUBO("Tubo"),
    _16_SPRAY("Spray"),
    _17_METRO("m"),
    _18_ROLLO("Rollo"),
    _19_PAR("Par");

    private final String value;

    UnitOfMeasureEnum(String value) {
        this.value = value;
    }
}
