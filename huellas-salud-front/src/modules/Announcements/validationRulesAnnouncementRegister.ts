import { RegisterOptions } from "react-hook-form";
import { Announcement, Appointment, Service } from "../../helper/typesHS";

type AnnouncementValidationRules = {
  [key in keyof Announcement]?: RegisterOptions<Announcement, key>;
}

export const announcementValidationRules: AnnouncementValidationRules = {

}
