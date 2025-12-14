import { RegisterOptions } from "react-hook-form";
import { Schedule } from "../../helper/typesHS";

type ScheduleValidationRules = {
  [key in keyof Schedule]?: RegisterOptions<Schedule, key>;
}

export const scheduleValidationRules: ScheduleValidationRules = {
  dayOfWeek: {

  }
}
