import { RegisterOptions } from "react-hook-form";
import { User } from "../../../helper/typesHS";

type ValidationRules = {
    [key in keyof User]?: RegisterOptions<User, key>;
};

export const validationRules: ValidationRules = {
    name: {
        required: "El nombre es obligatorio",
        minLength: {
            value: 3,
            message: "El nombre debe tener al menos 3 caracteres"
        }
    },
    lastName: {
        required: "El apellido es obligatorio",
        minLength: {
            value: 3,
            message: "El apellido debe tener al menos 3 caracteres"
        }
    },
    documentType: {
        required: "El tipo de documento es obligatorio"
    },
    documentNumber: {
        required: "El número de documento es obligatorio",
        minLength: {
            value: 8,
            message: "El número de documento debe tener al menos 8 caracteres"
        },
        maxLength: {
            value: 15,
            message: "El número de documento debe tener como máximo 15 caracteres"
        },
        pattern: {
            value: /^[0-9]+$/,
            message: "El número de documento debe ser numérico"
        }
    },
    email: {
        required: "El email es obligatorio",
        pattern: {
            value: /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/,
            message: "El email no es válido"
        }
    },
    cellPhone: {
        required: "El teléfono es obligatorio",
        minLength: {
            value: 7,
            message: "El teléfono debe tener al menos 7 dígitos"
        },
        maxLength: {
            value: 10,
            message: "El teléfono debe tener como máximo 10 dígitos"
        },
        pattern: {
            value: /^[0-9]+$/,
            message: "El teléfono debe ser numérico"
        }
    },
    address: {
        pattern: {
            value: /^(|[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s#-_.,'"]{8,})$/,
            message: "La dirección debe tener al menos 8 caracteres y no puede contener caracteres especiales"
        }
    },
    password: {
        required: "La contraseña es obligatoria",
        minLength: {
            value: 8,
            message: "La contraseña debe tener al menos 8 caracteres"
        }
    },
    confirmPassword: {
        required: "Debes confirmar tu contraseña",
        validate: (value, { password }) => value === password || "Las contraseñas no coinciden"
    }
}