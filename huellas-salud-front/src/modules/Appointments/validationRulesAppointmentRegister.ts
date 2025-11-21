import { RegisterOptions } from "react-hook-form";
import { Appointment, Service } from "../../helper/typesHS";

type AppointmentValidationRules = {
  [key in keyof Appointment]?: RegisterOptions<Appointment, key>;
}

export const appointmentValidationRules: AppointmentValidationRules = {
  date: {
    validate: (value) => {
      if (!value) return true;

      const selectedDateTime = new Date(value); // fecha + hora seleccionada
      const now = new Date();                  // fecha + hora actual

      // Permitir si es hoy pero hora futura
      if (selectedDateTime.toDateString() === now.toDateString()) {
        return selectedDateTime > now || "La hora debe ser futura";
      }

      // Permitir fechas futuras
      return selectedDateTime > now || "La fecha debe ser futura";
    }
  }
}
