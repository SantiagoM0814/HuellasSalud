package org.huellas.salud.helper.validators;

import io.quarkus.logging.Log;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.huellas.salud.domain.user.User;
import org.huellas.salud.domain.user.UserDocumentTypeEnum;
import org.huellas.salud.domain.user.UserMsg;
import org.huellas.salud.domain.user.UserRoleEnum;

import java.util.Arrays;

public class UserValidator implements ConstraintValidator<ValidUserInterface, UserMsg> {

    @Override
    public boolean isValid(UserMsg value, ConstraintValidatorContext context) {

        Log.debugf("@isValid > Inicia validacion del usuario con id: %s", value.getData().getDocumentNumber());

        User user = value.getData();

        if (Arrays.stream(UserDocumentTypeEnum.values())
                .noneMatch(documentType -> documentType.getAcron().equals(user.getDocumentType()))) {

            String message = "El tipo de documento ingresado: " + user.getDocumentType() + ", no es valido";

            Log.errorf("@isValid > %s", message);

            return createConstraintViolation(context, message);
        }

        if (user.getRole() != null && Arrays.stream(UserRoleEnum.values())
                .noneMatch(enumRole -> enumRole.getValue().equals(user.getRole()))) {

            String message = "El rol de usuario ingresado: " + user.getRole() + ", no es valido";

            Log.errorf("@isValid > %s", message);

            return createConstraintViolation(context, message);
        }

        Log.debug("@isValid > Finaliza validacion del usuario. Los datos ingresados son correctos");

        return true;
    }

    private boolean createConstraintViolation(ConstraintValidatorContext context, String message) {

        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message).addConstraintViolation();

        return false;
    }
}
