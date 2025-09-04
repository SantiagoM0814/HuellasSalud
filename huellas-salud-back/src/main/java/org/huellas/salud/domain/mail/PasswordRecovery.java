package org.huellas.salud.domain.mail;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Data
public class PasswordRecovery {

    @Valid
    private UserPassRecovery data;

    public record UserPassRecovery(

            @Schema(example = "password")
            @Size(min = 8, message = "La contraseña debe tener mínimo 8 caracteres")
            @NotBlank(message = "El valor de la nueva contraseña no puede ser nulo o vacío")
            String newPassword,

            @Schema(example = "a12501a8-3f2d-4b31-807a-285ea4be8982-1753239660434")
            @NotBlank(message = "El código de aprobación no puede ser nulo o vacío")
            String approvalCode
    ) {
    }
}
