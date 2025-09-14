import { Product } from "../../helper/typesHS";

export const productos = [{
    image: "../../assets/Huellas&Salud_1.png",
    name: "Dog chow",
    price: 22500,
    category: "Comida",
    brand: "Dog chow"
},
{
    image: "../../assets/Huellas&Salud_1.png",
    name: "Lazo para perro",
    price: 1200,
    category: "Para pasear",
    brand: "Animal factor"
},
{
    image: "../../assets/Huellas&Salud_1.png",
    name: "Dog chow",
    price: 22500,
    category: "Comida",
    brand: "Dog chow"
},
{
    image: "../../assets/Huellas&Salud_1.png",
    name: "Lazo para perro",
    price: 1200,
    category: "Para pasear",
    brand: "Animal factor"
},
{
    image: "../../assets/Huellas&Salud_1.png",
    name: "Dog chow",
    price: 22500,
    category: "Comida",
    brand: "Dog chow"
},
{
    image: "../../assets/Huellas&Salud_1.png",
    name: "Lazo para perro",
    price: 1200,
    category: "Para pasear",
    brand: "Animal factor"
},
{
    image: "../../assets/Huellas&Salud_1.png",
    name: "Dog chow",
    price: 22500,
    category: "Comida",
    brand: "Dog chow"
},
{
    image: "../../assets/Huellas&Salud_1.png",
    name: "Lazo para perro",
    price: 1200,
    category: "Para pasear",
    brand: "Animal factor"
}];

export const carrito = [{
    image: "../../assets/Huellas&Salud_1.png",
    name: "Dog chow",
    price: 22500,
    amount: 2
},
{
    image: "../../assets/Huellas&Salud_1.png",
    name: "Lazo para perro",
    price: 1200,
    amount: 1
}];

export const categorias = [
    { nombre: "Comida" },
    { nombre: "Cuidado e higiene" }
];

export const productosAdmin: Product[] = [
    {
        id: "1",
        image: "../productos/imagenes/dogchow.png",
        name: "Dog chow",
        price: 22500,
        stock: 18,
        supplier: "Dog chow",
        description: "Alimento premium para perros con proteínas de alta calidad, fibras naturales y prebióticos para una digestión saludable",
        unitMeasure: "l",
        expiration: new Date("2026-02-26"),
        barcode: 7501000123456,
        status: "activo",
        category: "Comida"
    },
    {
        id: "2",
        image: "../productos/imagenes/lazo.png",
        name: "Lazo para perro",
        price: 1200,
        stock: 5,
        supplier: "Animal Factor",
        description: "Lazo resistente y ajustable para pasear a tu perro con comodidad y seguridad. Fabricado con materiales duraderos y un diseño ergonómico.",
        unitMeasure: "unidad",
        expiration: null,
        barcode: 7501000234567,
        status: "inactivo",
        category: "Accesorios"
    },
    {
        id: "3",
        image: "../productos/imagenes/dogchow.png",
        name: "Dog chow",
        price: 22500,
        stock: 18,
        supplier: "Dog chow",
        description: "Alimento premium para perros con proteínas de alta calidad, fibras naturales y prebióticos para una digestión saludable",
        unitMeasure: "l",
        expiration: new Date("2026-02-26"),
        barcode: 7501000123456,
        status: "agotado",
        category: "Comida"
    },
    {
        id: "4",
        image: "../productos/imagenes/lazo.png",
        name: "Lazo para perro",
        price: 1200,
        stock: 5,
        supplier: "Animal Factor",
        description: "Lazo resistente y ajustable para pasear a tu perro con comodidad y seguridad. Fabricado con materiales duraderos y un diseño ergonómico.",
        unitMeasure: "unidad",
        expiration: null,
        barcode: 7501000234567,
        status: "activo",
        category: "Accesorios"
    }
];

export const marcas = [
    { nombre: "Bravecto" },
    { nombre: "Chunky" }
];

export const fieldsForm = [
    {
        label: "Nombre",
        type: "text",
        id: "nombre",
        placeholder: "Nombre producto"
    },
    {
        label: "Precio",
        type: "number",
        id: "precio",
        placeholder: "Precio"
    },
    {
        label: "Unidades",
        type: "number",
        id: "unidades",
        placeholder: "Unidades disponibles"
    },
    {
        label: "Categoría",
        type: "text",
        id: "categoria",
        placeholder: "Categoría"
    },
    {
        label: "Proveedor",
        type: "text",
        id: "proveedor",
        placeholder: "Proveedor"
    },
    {
        label: "Caducidad",
        type: "date",
        id: "caducidad",
        placeholder: "Caducidad"
    },
    {
        label: "Estado",
        type: "text",
        id: "estado",
        placeholder: "Estado"
    },
    {
        label: "Descripción",
        type: "textarea",
        id: "descripcion",
        placeholder: "Descripción del producto"
    }
];