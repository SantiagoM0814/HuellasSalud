package org.huellas.salud.domain.pet;

import lombok.Getter;

@Getter
public enum PetSexEnum {

    _0_MACHO("MACHO"),
    _1_HEMBRA("HEMBRA"),
    _2_INDETERMINADO("INDETERMINADO");

    private final String value;

    PetSexEnum(String value) {
        this.value = value;
    }
}
