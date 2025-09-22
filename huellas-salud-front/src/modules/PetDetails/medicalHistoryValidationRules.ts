import { RegisterOptions } from "react-hook-form";
import { MedicalHistory } from "../../helper/typesHS";

type MedicalHistoryValidationRules = {
  [key in keyof MedicalHistory]?: RegisterOptions<MedicalHistory, key>;
};

export const medicalHistoryValidationRules: MedicalHistoryValidationRules = {
  date: {
    required: "La fecha es obligatoria",
    validate: (value) => {
      if (!value) return "La fecha es obligatoria";
      const selectedDate = new Date(value);
      const today = new Date();
      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return selectedDate <= today || "La fecha no puede ser futura";
    },
  },
  diagnostic: {
    required: "El diagnóstico es obligatorio",
    minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
    maxLength: { value: 500, message: "No puede superar los 500 caracteres" },
  },
  treatment: {
    maxLength: { value: 500, message: "No puede superar los 500 caracteres" },
  },
  veterinarian: {
    required: "El nombre del veterinario es obligatorio",
    minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
    maxLength: { value: 100, message: "No puede superar los 100 caracteres" },
  },
  surgeries: {
    validate: (value) => {
      if (!value || value.length === 0) return true; // es opcional
      return value.every(s => s.length >= 3) || "Cada cirugía debe tener al menos 3 caracteres";
    }
  },
  vaccines: {
    validate: (value) => {
      if (!value || value.length === 0) return true; // es opcional
      return value.every(v => v.name && v.dateApplied) 
        || "Cada vacuna debe tener nombre y fecha aplicada";
    }
  },
};
