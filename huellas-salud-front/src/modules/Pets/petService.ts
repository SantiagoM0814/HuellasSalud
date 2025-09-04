import { useState } from "react"
import axiosInstance from "../../context/axiosInstance";
import { Pet, PetData } from "../../helper/typesHS";
import { toast } from "react-toastify";
import { handleError } from "../../helper/utils";
import Swal from "sweetalert2";

export const usePetService = () => {

    const [loading, setLoading] = useState<boolean>(false);

    const apiPets = {
        getPetsOwner: async (ownerId: string) => {
            const { data } = await axiosInstance.get<PetData[]>(`/pet/owners-pets/${ownerId}`,);
            return data;
        },
        getPets: async () => {
            const { data } = await axiosInstance.get<PetData[]>("/pet/list-pets");
            return data;
        },
        updatePet: async (pet: Pet) => {
            const dataUpdate = { data: pet }
            await axiosInstance.put(`/pet/update`, dataUpdate);
        },
        deletePet: async (pet: Pet) => {
            await axiosInstance.delete(`/pet/delete`, {
                params: {
                    identifierPet: pet.idPet,
                    idOwner: pet.idOwner
                }
            });
        }
    }

    const handleGetPetsOwner = async (ownerId: string) => {
        setLoading(true);
        toast.info("Cargando tus mascotas... ⌛", { autoClose: 1000 });

        try {
            const pets: PetData[] = await apiPets.getPetsOwner(ownerId);
            toast.success("¡Tus mascotas cargadas con éxito! 🎉", { autoClose: 1500 });
            return pets;
        } catch (error) {
            handleError(error, "Error al consultar las mascotas del propietario");
        } finally {
            setLoading(false);
        }
    };

    const handleGetPets = async () => {
        setLoading(true);
        toast.info("Cargando registros... ⌛", { autoClose: 1000 });

        try {
            const pets: PetData[] = await apiPets.getPets();
            toast.success("¡Registros cargados con éxito! 🎉", { autoClose: 1500 });
            return pets;
        } catch (error) {
            handleError(error, "Error al consultar las mascotas");
        } finally { setLoading(false); }
    }

    const handleUpdatePet = async (pet: Pet) => {
        setLoading(true);
        toast.info("Actualizando mascota... ⌛", { autoClose: 1000 });
        try {
            await apiPets.updatePet(pet);
            toast.success("¡Mascota actualizada con éxito! 🎉", { autoClose: 1500 });
        } catch (error) {
            handleError(error, "Error al actualizar la mascota");
        } finally { setLoading(false); }
    }

    const handleDeletePet = async (pet: Pet) => {
        setLoading(true);
        toast.info("Eliminando mascota... ⌛", { autoClose: 1000 });
        try {
            await apiPets.deletePet(pet);
            toast.success("¡Mascota eliminada con éxito! 🎉", { autoClose: 1500 });
            return pet.idPet;
        } catch (error) {
            handleError(error, "Error al eliminar la mascota");
        } finally { setLoading(false); }
    }

    const confirmUpdate = async (pet: Pet): Promise<boolean> => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas cambiar el estado de la mascota: ${pet.name} a ${pet.isActive ? "Inactivo" : "Activo"}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Actualizar estado mascota`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            pet.isActive = !pet.isActive;
            handleUpdatePet(pet);
            return true;
        }
        return false;
    }

    const confirmDelete = async (pet: Pet): Promise<string | undefined> => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas eliminar a la mascota: ${pet.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Si, eliminar mascota`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) return handleDeletePet(pet);
    }

    return {
        loading,
        handleGetPetsOwner,
        handleGetPets,
        confirmUpdate,
        confirmDelete
    }
} 
