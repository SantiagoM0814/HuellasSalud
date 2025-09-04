import { Pet } from "../../helper/typesHS";

export const fieldsFormPet = [
    {
        label: "Nombre",
        type: "text",
        id: "name",
        placeholder: "Nombre mascota"
    },
    {
        label: "Tipo",
        type: "text",
        id: "type",
        placeholder: "Tipo de mascota"
    },
    {
        label: "Raza",
        type: "text",
        id: "breed",
        placeholder: "Raza de mascota"
    },
    {
        label: "Edad",
        type: "number",
        id: "age",
        placeholder: "Edad de mascota"
    },
    {
        label: "Peso",
        type: "number",
        id: "weight",
        placeholder: "Peso de mascota"
    },
    {
        label: "Descripción",
        type: "textarea",
        id: "description",
        placeholder: "Descripción de mascota"
    },
    {
        label: "Estado",
        type: "text",
        id: "status",
        placeholder: "Estado de mascota"
    },
    {
        label: "Vacunas aplicadas",
        type: "text",
        id: "vaccines",
        placeholder: "Vacunas aplicadas a la mascota"
    },
    {
        label: "Cirugías realizadas",
        type: "text",
        id: "surgeries",
        placeholder: "Cirugías realizadas a la mascota"
    },
    {
        label: "Tratamientos realizados",
        type: "text",
        id: "treatments",
        placeholder: "Tratamientos realizados a la mascota"
    }
];

export const pets: Pet[] = [
    {
        id: "1",
        name: "Firulais",
        type: "Perro",
        breed: "Labrador",
        age: 3,
        weight: 30,
        styrofoam: true,
        description: "Perro juguetón y cariñoso",
        status: "Activo",
        vaccines: ["Vacuna rabia", "Vacuna parvovirus"],
        surgeries: ["Ninguna"],
        treatments: ["Ninguno"]
    },
    {
        id: "2",
        name: "Miau",
        type: "Gato",
        breed: "Siames",
        age: 2,
        weight: 5,
        styrofoam: false,
        description: "Gato tranquilo y cariñoso",
        status: "Inactivo",
        vaccines: ["Vacuna rabia", "Vacuna leucemia felina"],
        surgeries: ["Ninguna"],
        treatments: ["Ninguno"]
    }
];
