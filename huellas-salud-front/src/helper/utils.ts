import axios from "axios";
import { toast } from "react-toastify";

export const handleError = (error: unknown, message: string) => {
    let errorMessage = message;

    if (axios.isAxiosError(error)) {

        const { response, message } = error;

        if (response?.data?.title) {
            const detail = response.data.detail ? `. ${response.data.detail}` : "";
            errorMessage = `${response.data.title}${detail}`;
        } else if (response?.status === 401) {
            errorMessage = "No tienes permisos para realizar esta acción";
        } else {
            errorMessage = message || "Error en la comunicación con el servidor";
        }
    } else if (error instanceof Error) errorMessage = error.message;

    toast.error(`${errorMessage} ❌`);
}