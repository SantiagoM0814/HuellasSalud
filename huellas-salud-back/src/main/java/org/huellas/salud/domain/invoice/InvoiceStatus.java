package org.huellas.salud.domain.invoice;

import lombok.Getter;

@Getter
public enum InvoiceStatus {
    PENDIENTE("Pendiente"),
    CANCELADA("Cancelada"),
    PAGADA("Pagada");

    private final String value;

    InvoiceStatus(String value) {
        this.value = value;
    }
}