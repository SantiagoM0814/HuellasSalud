import { useState } from "react";
import { toast } from "react-toastify";
import { UserData, User } from "../../../helper/typesHS";
import { handleError } from "../../../helper/utils";
import axiosInstance from "../../../context/axiosInstance";
import Swal from "sweetalert2";

export const useUserService = () => {

    const [loading, setLoading] = useState<boolean>(false);

    const api = {
        getUsers: async () => {
            const { data } = await axiosInstance.get<UserData[]>("/user/list-users");
            return data;
        },
        getVeterinarians: async () => {
            const { data } = await axiosInstance.get<UserData[]>("/user/list-veterinarians");
            return data;
        },
        updateUser: async (user: User) => {
            const dataUpdate = { data: user }
            await axiosInstance.put(`/user/update`, dataUpdate);
        },
        deleteUser: async (user: User) => {
            await axiosInstance.delete(`/user/delete`, {
                params: {
                    documentNumber: user.documentNumber,
                    emailUser: user.email
                }
            });
        }
    }

    const handleGetUsers = async () => {
        setLoading(true);
        toast.info("Cargando usuarios... ⌛", { autoClose: 1000 });
        try {
            const users: UserData[] = await api.getUsers();
            toast.success("¡Usuarios cargados con éxito! 🎉", { autoClose: 1500 });
            return users;
        } catch (error) {
            handleError(error, "Error al consultar los usuarios");
        } finally { setLoading(false); }
    }

    const handleGetVeterinarians = async () => {
        setLoading(true);
        toast.info("Cargando veterinarios... ⌛", { autoClose: 1000 });
        try {
            const users: UserData[] = await api.getVeterinarians();
            toast.success("Veterinarios cargados con éxito! 🎉", { autoClose: 1500 });
            return users;
        } catch (error) {
            handleError(error, "Error al consultar los veterinarios");
        } finally { setLoading(false); }
    }

    const handleUpdateUser = async (user: User) => {
        setLoading(true);
        toast.info("Actualizando usuario... ⌛", { autoClose: 1000 });
        try {
            await api.updateUser(user);
            toast.success("¡Usuario actualizado con éxito! 🎉", { autoClose: 1500 });
        } catch (error) {
            handleError(error, "Error al actualizar el usuario");
        } finally { setLoading(false); }
    }

    const handleDeleteUser = async (user: User) => {
        setLoading(true);
        toast.info("Eliminando usuario... ⌛", { autoClose: 1000 });
        try {
            await api.deleteUser(user);
            toast.success("¡Usuario eliminado con éxito! 🎉", { autoClose: 1500 });
            return user.documentNumber;
        } catch (error) {
            handleError(error, "Error al eliminar el usuario");
        } finally { setLoading(false); }
    }

    const confirmUpdate = async (user: User, action: string): Promise<boolean> => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas actualizar el ${action} del usuario ${user.name} ${user.lastName}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Actualizar ${action} usuario`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            user.active = !user.active;
            handleUpdateUser(user);
            return true;
        }
        return false;
    }

    const confirmDelete = async (user: User): Promise<string | undefined> => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas eliminar al usuario ${user.name} ${user.lastName}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Si, eliminar usuario`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) return handleDeleteUser(user);
    }

    return { handleGetUsers, handleGetVeterinarians, loading, confirmUpdate, confirmDelete };
}
