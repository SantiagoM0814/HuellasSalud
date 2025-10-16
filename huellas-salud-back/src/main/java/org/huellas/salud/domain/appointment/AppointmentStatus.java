package org.huellas.salud.domain.appointment;

import lombok.Getter;

@Getter
public enum AppointmentStatus {
    PENDIENTE("Pendiente"),
    CONFIRMADA("Confirmada"),
    CANCELADA("Cancelada"),
    FINALIZADA("Finalizada");

    private final String value;

    AppointmentStatus(String value) {
        this.value = value;
    }
}