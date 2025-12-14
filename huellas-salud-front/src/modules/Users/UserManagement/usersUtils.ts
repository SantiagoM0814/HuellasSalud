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

export const tableScheduleColumns: string[] = [
    "Nombre Veterinario",
    "Día Semana",
    "Hora Inicio",
    "Hora Fin",
    "Inicio Almuerzo",
    "Fin Almuerzo",
    "Estado",
    "Acciones"
];

export const tableAnnouncementColumns: string[] = [
    "Nombre Publicador",
    "Descripción",
    "Estado",
    "Acciones",
];

export const tableInvoiceColumns: string[] = [
    "Nombre Cliente",
    "Productos o servicios",
    "Fecha facturación",
    "Valor total",
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
        .toLocaleString("es-ES", optionsDate)
        .replaceAll("/", "-")
        .replace(",", " -")
        .replace(/\s?a\.?\s*m\.?/i, " A.M.").replace(/\s?p\.?\s*m\.?/i, " P.M.");
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

export const statusInvoices = [
    { value: "ALL", label: "Todos los estados" },
    { value: "PAGADA", label: "Pagada" },
    { value: "PENDIENTE", label: "Pendiente" },
    { value: "CANCELADA", label: "Cancelada" },
];

export const statusAppointments = [
    { value: "ALL", label: "Todos los estados" },
    { value: "FINALIZADA", label: "Finalizada" },
    { value: "PENDIENTE", label: "Pendiente" },
    { value: "CANCELADA", label: "Cancelada" },
];

export const daySchedules = [
    { value: "ALL", label: "Todos los días" },
    { value: "MONDAY", label: "Lunes" },
    { value: "TUESDAY", label: "Martes" },
    { value: "WEDNESDAY", label: "Miercoles" },
    { value: "THURSDAY", label: "Jueves" },
    { value: "FRIDAY", label: "Viernes" },
    { value: "SATURDAY", label: "Sabado" },
    { value: "SUNDAY", label: "Domingo" },
];

export const daySchedule = [
    { value: "MONDAY", label: "Lunes" },
    { value: "TUESDAY", label: "Martes" },
    { value: "WEDNESDAY", label: "Miercoles" },
    { value: "THURSDAY", label: "Jueves" },
    { value: "FRIDAY", label: "Viernes" },
    { value: "SATURDAY", label: "Sabado" },
    { value: "SUNDAY", label: "Domingo" },
];

export const schedules = [
  { value: "00:00:00", label: "00:00" },
  { value: "01:00:00", label: "01:00" },
  { value: "02:00:00", label: "02:00" },
  { value: "03:00:00", label: "03:00" },
  { value: "04:00:00", label: "04:00" },
  { value: "05:00:00", label: "05:00" },
  { value: "06:00:00", label: "06:00" },
  { value: "07:00:00", label: "07:00" },
  { value: "08:00:00", label: "08:00" },
  { value: "09:00:00", label: "09:00" },
  { value: "10:00:00", label: "10:00" },
  { value: "11:00:00", label: "11:00" },
  { value: "12:00:00", label: "12:00" },
  { value: "13:00:00", label: "13:00" },
  { value: "14:00:00", label: "14:00" },
  { value: "15:00:00", label: "15:00" },
  { value: "16:00:00", label: "16:00" },
  { value: "17:00:00", label: "17:00" },
  { value: "18:00:00", label: "18:00" },
  { value: "19:00:00", label: "19:00" },
  { value: "20:00:00", label: "20:00" },
  { value: "21:00:00", label: "21:00" },
  { value: "22:00:00", label: "22:00" },
  { value: "23:00:00", label: "23:00" },
  { value: "24:00:00", label: "24:00" }
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
