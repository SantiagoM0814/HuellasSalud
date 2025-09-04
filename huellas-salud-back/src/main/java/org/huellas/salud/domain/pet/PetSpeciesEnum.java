package org.huellas.salud.domain.pet;

import lombok.Getter;

@Getter
public enum PetSpeciesEnum {

    _0_PERRO("PERRO"),
    _1_GATO("GATO"),
    _2_CONEJO("Conejo"),
    _3_ROEDOR("ROEDOR"),
    _5_MONO("Mono"),
    _7_CHIMPANCE("Chimpancé"),
    _8_AVE("AVE"),
    _15_TORTUGA("Tortuga"),
    _16_REPTIL("REPTIL"),
    _17_CAMALEON("Camaleón"),
    _19_PESCADO("PESCADO"),
    _22_CABALLO("Caballo"),
    _23_BURRO("Burro"),
    _24_VACA("Vaca"),
    _25_TORO("Toro"),
    _26_CABRA("Cabra"),
    _27_OVEJA("Oveja"),
    _28_CERDO("Cerdo"),
    _29_ERIZO("Erizo"),
    _30_ZARIGUEYA("Zarigüeya"),
    _31_MAPACHE("Mapache"),
    _32_MONO_TITI("Mono Tití"),
    _33_ARDILLA("Ardilla"),
    _34_CIERVO("Ciervo"),
    _35_ZORRO("Zorro"),
    _36_COYOTE("Coyote"),
    _37_AGUILA("Águila");

    private final String value;

    PetSpeciesEnum(String value) { this.value = value; }
}
