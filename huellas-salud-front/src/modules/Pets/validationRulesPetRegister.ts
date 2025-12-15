import { RegisterOptions } from "react-hook-form";
import { Pet } from "../../helper/typesHS";

type ValidationRules = {
  [key in keyof Pet]?: RegisterOptions<Pet, key>;
};

export const validationRules: ValidationRules = {
  idOwner: {
    required: "El ID del propietario es obligatorio",
    minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
    maxLength: { value: 15, message: "Debe tener como máximo 15 caracteres" },
    pattern: { value: /^[0-9]+$/, message: "Debe ser numérico" },
  },
  name: {
    required: "El nombre es obligatorio",
    minLength: { value: 3, message: "El nombre debe tener al menos 3 caracteres" },
  },
  species: {
    required: "La especie es obligatoria",
  },
  breed: {
    required: "La raza es obligatoria",
  },
  sex: {
    required: "El sexo es obligatorio",
  },
  age: {
    required: "La edad es obligatoria",
    min: { value: 0, message: "La edad no puede ser negativa" },
  },
  weight: {
    required: "El peso es obligatorio",
    min: { value: 0, message: "El peso no puede ser negativo" },
  },
  sterilized: {
    required: "Debes indicar si la mascota está esterilizada",
  },
  disability: {
    maxLength: { value: 100, message: "El texto no puede superar 100 caracteres" },
  },
  description: {
    maxLength: { value: 500, message: "La descripción no puede superar 500 caracteres" },
  },
  medicalHistory: {},
  mediaFile: {},
};
