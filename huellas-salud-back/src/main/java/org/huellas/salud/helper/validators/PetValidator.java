package org.huellas.salud.helper.validators;

import io.quarkus.logging.Log;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.huellas.salud.domain.pet.Pet;
import org.huellas.salud.domain.pet.PetSexEnum;
import org.huellas.salud.domain.pet.PetSpeciesEnum;

import java.util.Arrays;

public class PetValidator implements ConstraintValidator<ValidPetInterface, Pet> {

    @Override
    public boolean isValid(Pet pet, ConstraintValidatorContext context) {

        Log.debug("@isValid > Inicia ejecucion de validacion de la informacion de la mascota ingresada");

        if (Arrays.stream(PetSpeciesEnum.values()).noneMatch(specie -> specie.getValue().equals(pet.getSpecies()))) {
            String message = "La especie de animal ingresada: " + pet.getSpecies() + ", no es valida";
            Log.errorf("@isValid > %s", message);
            return createConstraintViolation(context, message);
        }

        if (Arrays.stream(PetSexEnum.values()).noneMatch(petSex -> petSex.getValue().equals(pet.getSex()))) {
            String message = String.format("El sexo de la mascota ingresado: %s, no es valido", pet.getSex());
            Log.errorf("@isValid > %s", message);
            return createConstraintViolation(context, message);
        }

        return true;
    }

    private boolean createConstraintViolation(ConstraintValidatorContext context, String message) {

        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message).addConstraintViolation();

        return false;
    }
}
