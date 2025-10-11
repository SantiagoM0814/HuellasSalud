import { RegisterOptions } from "react-hook-form";

type WeightPriceRule = {
  minWeight: number;
  maxWeight: number;
  price: number;
};

type Service = {
  idService?: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  basePrice: number;
  priceByWeight: boolean;
  weightPriceRules?: WeightPriceRule[];
};

export const serviceValidationRules: { [K in keyof Service]?: RegisterOptions<Service, K> } = {
  name: {
    required: "El campo nombre no puede ser nulo o vacío",
    minLength: { value: 5, message: "El campo nombre debe tener al menos 5 caracteres" },
    maxLength: { value: 40, message: "El campo nombre no puede tener más de 40 caracteres" },
    pattern: {
      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9&\-]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ0-9&\-]+)*$/,
      message: "El nombre no debe contener caracteres especiales ni espacios al inicio o final",
    },
  },
  shortDescription: {
    required: "El campo descripción corta no puede ser nulo o vacío",
    minLength: { value: 20, message: "La descripción corta debe tener al menos 20 caracteres" },
    maxLength: { value: 250, message: "La descripción corta no puede superar los 250 caracteres" },
  },
  longDescription: {
    required: "El campo descripción larga no puede ser nulo o vacío",
    minLength: { value: 100, message: "La descripción larga debe tener al menos 100 caracteres" },
    maxLength: { value: 500, message: "La descripción larga no puede superar los 500 caracteres" },
  },
  basePrice: {
    required: "El campo precio base no puede ser nulo o vacío",
    min: { value: 0.01, message: "El precio base debe ser mayor a 0" },
  },
  priceByWeight: {
    required: "Debe especificar si el precio depende del peso",
  },
  weightPriceRules: {
    validate: (rules: WeightPriceRule[] | undefined) => {
      if (!rules || rules.length === 0) {
        return "Debe definir al menos una regla de precio por peso";
      }
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (
          typeof rule.minWeight !== "number" ||
          typeof rule.maxWeight !== "number" ||
          typeof rule.price !== "number"
        ) {
          return `La regla #${i + 1} debe tener minWeight, maxWeight y price como números`;
        }
        if (rule.minWeight < 0) {
          return `minWeight en regla #${i + 1} no puede ser negativo`;
        }
        if (rule.maxWeight <= rule.minWeight) {
          return `maxWeight debe ser mayor que minWeight en regla #${i + 1}`;
        }
        if (rule.price < 0) {
          return `price no puede ser negativo en regla #${i + 1}`;
        }
      }
      return true;
    },
  },
};
