import { useState } from "react";
import { toast } from "react-toastify";
import { PetData, CreateHistoryModalProps, MedicalHistory } from "../../helper/typesHS";
import { handleError } from "../../helper/utils";
import axiosInstance from "../../context/axiosInstance";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

export const usePetDetailsService = () => {
    const [loading, setLoading] = useState(false);


    const handleGetPet = async (idPet: string) => {
        setLoading(true);
        toast.info("Cargando mascota... ⌛", { autoClose: 1000 });
        try {
            const { data } = await axiosInstance.get<PetData>(`pet/${idPet}`)
            toast.success("¡Mascota cargada con éxito! 🎉", { autoClose: 1500 });
            return data;
        } catch (error) {
            handleError(error, "Error al consultar la mascota");
        } finally { setLoading(false); }
    }
    return { handleGetPet, loading };
}

export const useHistoryRegister = ({ setModalHistory, setPetData }: CreateHistoryModalProps) => {
    const { idPet } = useParams<{ idPet: string }>();
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<MedicalHistory>()

    const createHistory = async (historyData: MedicalHistory, idPet: string) => {
        toast.info(`Creando registro de historia medica... ⌛`, { autoClose: 1200 });

        const { data: createdHistory } = await axiosInstance.post<MedicalHistory>(`pet/${idPet}/medical-history`, historyData);

        setPetData && setPetData(prev => [...(prev ?? []), createdHistory]);
        return createdHistory;
    };

    const handleError = (error: unknown) => {
        setErrorMsg("Error en servicio de creación de historial medico");
        let errorMessage = "Error desconocido al crear historial medico";

        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.title
                ? `${error.response.data.title}. ${error.response.data.detail || ''}`
                : error.message || 'Error en la comunicación con el servidor';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast.error(`${errorMessage} ❌`);
    }

    const onSubmit = async (mHistory: MedicalHistory) => {
        setLoading(true);

        try {
            if (!idPet) {
                toast.error("No se encontró el ID de la mascota");
                return;
            }
            await createHistory(mHistory, idPet);
            toast.success("Historial registrado con éxito! 🎉");
            setErrorMsg("");
            reset();
            setModalHistory && setModalHistory(false);
        } catch (error) { handleError(error); }
        finally { setLoading(false); }
    }

    return {
        errorMsg,
        handleCreateHistorySubmit: onSubmit,
        loading,
        register,
        errors,
        handleSubmit,
        reset
    }
}
