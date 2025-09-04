import { CategoryGroup, CategoryCard, SubMenuProps } from "../../helper/typesHS";
import prdPopularCat from "../../assets/Comida_Gato.webp";
import prdPopularDog from "../../assets/TratamientosEspecializados.webp";
import prdPopularOther from "../../assets/PeluqueriaBienestar.webp";

export const listDogCategories: CategoryCard[] = [
    { name: "Comida", img: "fa-solid fa-bowl-food" },
    { name: "Salud", img: "fa-solid fa-suitcase-medical" },
    { name: "Hogar Perros", img: "fa-solid fa-house-chimney" },
    { name: "Cuidado e Higiene", img: "fa-solid fa-scissors" },
    { name: "Accesorios", img: "fa-solid fa-bone" },
    { name: "Limpieza", img: "fa-solid fa-spray-can-sparkles" },
    { name: "Juguetes", img: "fa-solid fa-baseball" },
];

export const listCatCategories: CategoryCard[] = [
    { name: "Comida", img: "fa-solid fa-bowl-food" },
    { name: "Salud", img: "fa-solid fa-suitcase-medical" },
    { name: "Gimnasios", img: "fa-solid fa-dumbbell" },
    { name: "Arena y Areneras", img: "fa-solid fa-hourglass-half" },
    { name: "Accesorios", img: "fa-solid fa-bone" },
    { name: "Cuidado e Higiene", img: "fa-solid fa-spray-can-sparkles" },
    { name: "Juguetes", img: "fa-solid fa-baseball" },
];

export const listOtherCategories: CategoryCard[] = [
    { name: "Peces", img: "fa-solid fa-fish-fins" },
    { name: "Aves", img: "fa-solid fa-crow" },
    { name: "Roedores", img: "fa-solid fa-otter" },
    { name: "Conejos", img: "fa-solid fa-paw" },
    { name: "Caballos", img: "fa-solid fa-horse" },
];

export const dogCategoryOptions: CategoryGroup[] = [
    {
        name: "Comida",
        options: [
            "Concentrados",
            "Alimento humedo",
            "Alimento medicado",
            "Snacks y galletas",
            "Huesos"
        ],
    },
    {
        name: "Salud",
        options: [
            "Medicamentos",
            "Suplementos",
            "Vitaminas",
            "Antipulgas y garrapatas",
            "Desparasitantes",
        ],
    },
    {
        name: "Hogar Perros",
        options: [
            "Camas y mantas",
            "Colchonetas",
            "Casas y Guacales",
            "Comederos y Bebederos",
            "Cercas y divisores",
        ],
    },
    {
        name: "Cuidado e Higiene",
        options: [
            "Shampoos y Jabones",
            "Pañitos y Tapetes",
            "Cuidado de piel",
            "Colonias",
            "Cepillos y Peines",
        ],
    },
    {
        name: "Accesorios",
        options: [
            "Correas y Placas",
            "Arneses y Pecheras",
            "Collares",
            "Bozales",
            "Protectores",
        ],
    },
    {
        name: "Limpieza",
        options: [
            "Desinfectantes",
            "Ambientadores",
            "Shampoo y Jabones",
            "Bolsas y Residuos",
            "Cuidado oral",
        ],
    },
    {
        name: "Juguetes",
        options: [
            "Pelotas",
            "Huesos",
            "Con cuerda",
            "Mordedores",
            "Frisbees",
        ],
    },
    {
        name: "Farmacia",
        options: [
            "Desparasitantes",
            "Suplementos y Vitaminas",
            "Analgésicos",
            "Antibióticos",
            "Digestivos",
        ],
    }
];

export const catCategoryOptions: CategoryGroup[] = [
    {
        name: "Comida",
        options: [
            "Concentrados",
            "Alimento humedo",
            "Alimento medicado",
            "Snacks y galletas",
            "Natural"
        ],
    },
    {
        name: "Farmacia",
        options: [
            "Desparasitantes",
            "Suplementos y Vitaminas",
            "Analgésicos",
            "Antibióticos",
            "Digestivos",
        ],
    },
    {
        name: "Gimnasios",
        options: [
            "Gimnasios y Rascadores",
            "Casitas y Camas",
            "Colchonetas y mantas",
            "Guacales y Maletines",
            "Comederos y Bebederos",
        ],
    },
    {
        name: "Arena y Areneras",
        options: [
            "Areneras",
            "Arena",
            "Desinfectantes",
            "Ambientadores",
            "Cuidado oral",
        ],
    },
    {
        name: "Cuidado e Higiene",
        options: [
            "Shampoos y Jabones",
            "Estimulantes",
            "Cuidado de piel",
            "Colonias",
            "Cepillos y Peines",
        ],
    },
    {
        name: "Accesorios",
        options: [
            "Correas y Placas",
            "Arneses y Pecheras",
            "Collares",
            "Bozales",
            "Protectores",
        ],
    },
    {
        name: "Salud",
        options: [
            "Medicamentos y Antibióticos",
            "Suplementos",
            "Vitaminas",
            "Antipulgas y garrapatas",
            "Desparasitantes",
        ],
    },
    {
        name: "Juguetes",
        options: [
            "Pelotas y Lanzadores",
            "Ratones y Huesos",
            "Peluches",
            "Sonajeros",
            "Túneles",
        ],
    }
];

export const otherCategoryOptions: CategoryGroup[] = [
    {
        name: "Peces",
        options: [
            "Alimento",
            "Acuarios y Peceras",
            "Medicamentos",
            "Vitaminas",
            "Otros",
        ],
    },
    {
        name: "Aves",
        options: [
            "Alimento",
            "Jaulas",
            "Comederos y Bebederos",
            "Salud e Higiene",
            "Accesorios y Juguetes"
        ],
    },
    {
        name: "Roedores",
        options: [
            "Alimento y Vitaminas",
            "Casas y Jaulas",
            "Comederos y Bebederos",
            "Salud e Higiene",
            "Accesorios y Juguetes"
        ],
    },
    {
        name: "Caballos",
        options: [
            "Alimento",
            "Vitaminas y Suplementos",
            "Salud",
            "Cuidado e Higiene",
            "Accesorios"
        ],
    }
];

export const popularDogBreeds: CategoryCard[] = [
    { name: "Royal Canin", img: prdPopularDog },
    { name: "Purina", img: prdPopularDog },
    { name: "Pedigree", img: prdPopularDog },
    { name: "Whiskas", img: prdPopularDog },
    { name: "Hills", img: prdPopularDog },
    { name: "Proplan", img: prdPopularDog },
    { name: "Nutra Nuggets", img: prdPopularDog },
    { name: "Taste of the Wild", img: prdPopularDog }
];

export const popularCatBreeds: CategoryCard[] = [
    { name: "Royal Canin", img: prdPopularCat },
    { name: "Purina", img: prdPopularCat },
    { name: "Whiskas", img: prdPopularCat },
    { name: "Hills", img: prdPopularCat },
    { name: "Proplan", img: prdPopularCat },
    { name: "Nutra Nuggets", img: prdPopularCat },
    { name: "Taste of the Wild", img: prdPopularCat }
];

export const popularOtherBreeds: CategoryCard[] = [
    { name: "Piamontina", img: prdPopularOther },
    { name: "Incros", img: prdPopularOther },
    { name: "Omega One", img: prdPopularOther },
    { name: "Agrinal", img: prdPopularOther },
];

export const MENU_DATA: Record<
    SubMenuProps["option"], {
        categories: CategoryCard[];
        options: CategoryGroup[];
        popular: CategoryCard[];
    }
> = {
    Perros: {
        categories: listDogCategories,
        options: dogCategoryOptions,
        popular: popularDogBreeds,
    },
    Gatos: {
        categories: listCatCategories,
        options: catCategoryOptions,
        popular: popularCatBreeds,
    },
    "Otras Mascotas": {
        categories: listOtherCategories,
        options: otherCategoryOptions,
        popular: popularOtherBreeds,
    },
};