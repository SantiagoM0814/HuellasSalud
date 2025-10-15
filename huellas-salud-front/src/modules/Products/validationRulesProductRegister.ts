import { RegisterOptions } from "react-hook-form";
import { Product } from "../../helper/typesHS";

type ProductValidationRules = {
  [key in keyof Product]?: RegisterOptions<Product, key>;
};

export const productValidationRules: ProductValidationRules = {
  idProduct: {
    required: "El ID del producto es obligatorio",
    minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
  },
  name: {
    required: "El nombre es obligatorio",
    minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
    maxLength: { value: 100, message: "No puede superar los 100 caracteres" },
  },
  category: {
    required: "La categoría es obligatoria",
  },
  animalType: {
    required: "El tipo de animal es obligatorio",
  },
  description: {
    required: "La descripción es obligatoria",
    minLength: { value: 1, message: "La descripción debe tener al menos 15 caracteres"},
    maxLength: { value: 500, message: "La descripción no puede superar 500 caracteres" },
  },
  price: {
    required: "El precio es obligatorio",
    min: { value: 0, message: "El precio no puede ser negativo" },
  },
  unitOfMeasure: {
    required: "La unidad de medida es obligatoria",
  },
  quantityAvailable: {
    required: "La cantidad es obligatoria",
    min: { value: 0, message: "La cantidad no puede ser negativa" },
  },
  brand: {
    required: "La marca es obligatoria",
    minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
  },
  expirationDate: {
    validate: (value) => {
    if (!value) return true; // ✅ Permitir vacío
    const selectedDate = new Date(value); // ✅ Convertir string a Date
    const today = new Date();

    // Poner la hora en 00:00:00 para evitar errores de comparación por la hora
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return selectedDate > today || "La fecha de vencimiento debe ser futura";
  },
  },
  barcode: {
    required: "El código de barras es obligatorio",
    pattern: {
      value: /^[0-9]{6,13}$/,
      message: "Debe ser un número de entre 6 y 13 dígitos",
    },
  },
  active: {
    required: "El estado es obligatorio",
  },
  supplier: {
    required: "El proveedor es obligatorio",
    minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
  },
};
