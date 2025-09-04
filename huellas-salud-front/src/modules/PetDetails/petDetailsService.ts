import { useState } from "react";
import { toast } from "react-toastify";
import { PetData, Pet } from "../../helper/typesHS";
import { handleError } from "../../helper/utils";
import axiosInstance from "../../context/axiosInstance";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

export const usePetDetailsService = () => {
    const [loading, setLoading] = useState(false);


    const handleGetPet = async (idPet: string) => {
        setLoading(true);
        toast.info("Cargando mascota... ⌛", { autoClose: 1000 });
        try {
            const {data} = await axiosInstance.get<PetData>(`pet/${idPet}`)
            toast.success("¡Mascota cargada con éxito! 🎉", { autoClose: 1500 });
            return data;
        } catch (error) {
            handleError(error, "Error al consultar la mascota");
        } finally { setLoading(false); }
    }

    return { handleGetPet, loading };
}
