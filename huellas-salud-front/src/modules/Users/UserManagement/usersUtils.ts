import { User } from "../../../helper/typesHS";

export const tableColumns: string[] = [
    "Nombre",
    "Tipo Doc.",
    "N° Doc.",
    "Rol",
    "Teléfono",
    "Correo",
    "Estado",
    "Acciones",
];

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

export const roles = [
    "ADMINISTRADOR",
    "CLIENTE",
    "VETERINARIO",
    "RECEPCIONISTA",
];

export const species = [
    "ALL",
    "PERRO",
    "GATO",
    "ROEDOR",
    "AVE",
    "REPTIL",
    "PESCADO",
];

export const sexOptionsFilter = [
    { value: "ALL", label: "Todos los géneros" },
    { value: "MACHO", label: "Macho" },
    { value: "HEMBRA", label: "Hembra" },
    { value: "INDETERMINADO", label: "Indeterminado" },
];

export const statusOptions = [
    { value: "ALL", label: "Todos los estados" },
    { value: "ACTIVE", label: "Activo" },
    { value: "INACTIVE", label: "Inactivo" },
];

export const userEmpty: User = {
    name: "",
    lastName: "",
    documentType: "CC",
    documentNumber: "",
    address: "",
    email: "",
    cellPhone: "",
    password: "",
    role: "ADMINISTRADOR",
};

export const metaEmpty = {
    creationDate: "",
    ipAddress: "",
    source: "",
    lastUpdate: "",
};
