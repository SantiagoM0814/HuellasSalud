package org.huellas.salud.domain.user;

import lombok.Getter;

@Getter
public enum UserDocumentTypeEnum {

    _0_CEDULA_DE_CIUDADANIA("CEDULA_DE_CIUDADANIA", "CC"),
    _1_TARJETA_DE_IDENTIDAD("TARJETA_DE_IDENTIDAD", "TI"),
    _2_CEDULA_DE_EXTRANJERIA("CEDULA_DE_EXTRANJERIA", "CE"),
    _3_PERMISO_ESPECIAL_DE_PERMANENCIA("PERMISO_ESPECIAL_DE_PERMANENCIA", "PEP"),
    _4_PERMISO_DE_PROTECCION_TEMPORAL("PERMISO_DE_PROTECCION_TEMPORAL", "PPT"),
    _5_PASAPORTE("PASAPORTE", "PA");

    private final String value;
    private final String acron;

    UserDocumentTypeEnum(String value, String acron) {
        this.value = value;
        this.acron = acron;
    }
}
