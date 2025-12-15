import { Pet, Sex, Species } from "../../helper/typesHS";

const optionsDate: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
};

export const formatDate = (date: string | Date): string => {
    return new Date(date)
        .toLocaleString("en-US", optionsDate)
        .replaceAll("/", "-")
        .replace(",", " -");
};

export const petEmpty: Pet = {
    idPet: "",
    idOwner: "",
    name: "",
    species: "" as Species,
    breed: "",
    sex: "" as Sex,
    age: 0,
    weight: 0,
    sterilized: false,
    disability: "",
    description: "",
    isActive: true,
    medicalHistory: [],
    mediaFile: undefined
};

export const metaEmpty = {
    creationDate: "",
    ipAddress: "",
    source: "",
    lastUpdate: "",
};