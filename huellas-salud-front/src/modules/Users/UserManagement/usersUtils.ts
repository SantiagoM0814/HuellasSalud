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

export const tableProductColumns: string[] = [
    "Nombre",
    "Marca",
    "Valor",
    "Unidades",
    "Categoria",
    "Estado",
    "Acciones",
];

export const tableServiceColumns: string[] = [
    "Nombre",
    "Descripción corta",
    "Precio base",
    "Estado",
    "Acciones",
];

export const tableAppointmentColumns: string[] = [
    "Nombre Cliente",
    "Nombre Mascota",
    "Fecha",
    "Veterinario",
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

export const categorys = [
    { value: "COMIDA", label: "Comida"},
    { value: "JUGUETES", label: "Juguetes"},
    { value: "MEDICINA", label: "Medicina"},
    { value: "ACCESORIOS", label: "Accesorios"},
    { value: "HIGIENE", label: "Higiene"},
    {value: "EQUIPOS", label: "Equipos"}
];

export const unitOfMeasure = [
    { value: "UNIDAD", label: "Unidad"},
    { value: "PAQUETE", label: "Paquete"},
    { value: "CAJA", label: "Caja"},
    { value: "GRAMO", label: "g"},
    { value: "KILOGRAMO", label: "kg"},
    {value: "MILILITRO", label: "ml"},
    {value: "LITRO", label: "l"},
    {value: "TABLETA", label: "Tableta"},
    {value: "CAPSULA", label: "Cápsula"},
    {value: "FRASCO", label: "Frasco"},
    {value: "AMPOLLA", label: "Ampolla"},
    {value: "TIRA", label: "Tira"},
    {value: "BLISTER", label: "Blíster"},
    {value: "SOBRE", label: "Sobre"},
] as const;

export type UnitOfMeasure = typeof unitOfMeasure[number]["value"];

export const species = [
    { value: "PERRO", label: "Perro"},
    { value: "GATO", label: "Gato"},
    { value: "ROEDOR", label: "Roedor"},
    { value: "AVE", label: "Ave"},
    { value: "REPTIL", label: "Reptil"},
    { value: "PESCADO", label: "Pescado"},
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
