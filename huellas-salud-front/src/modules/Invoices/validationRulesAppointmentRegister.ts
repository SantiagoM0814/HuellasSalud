import { RegisterOptions } from "react-hook-form";
import { Appointment, Service } from "../../helper/typesHS";

type AppointmentValidationRules = {
  [key in keyof Appointment]?: RegisterOptions<Appointment, key>;
}

export const appointmentValidationRules: AppointmentValidationRules = {
  date: {
    validate: (value) => {
      if (!value) return true;
      const selectedDate = new Date(value);
      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      return selectedDate > today || "La fecha debe ser futura";
    }
  }
}
