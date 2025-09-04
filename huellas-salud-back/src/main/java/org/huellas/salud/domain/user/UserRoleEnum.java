package org.huellas.salud.domain.user;

import lombok.Getter;

@Getter
public enum UserRoleEnum {

    _0_ADMINISTRADOR("ADMINISTRADOR"),
    _1_VETERINARIO("VETERINARIO"),
    _2_RECEPCIONISTA("RECEPCIONISTA"),
    _3_CLIENTE("CLIENTE");

    private final String value;

    UserRoleEnum(String value) {
        this.value = value;
    }
}
