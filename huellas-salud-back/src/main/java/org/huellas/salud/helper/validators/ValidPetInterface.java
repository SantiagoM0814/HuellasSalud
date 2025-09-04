package org.huellas.salud.helper.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PetValidator.class)
public @interface ValidPetInterface {

    String message() default "Datos de mascota inválidos";

    Class<? extends Payload>[] payload() default {};

    Class<?>[] groups() default {};
}
