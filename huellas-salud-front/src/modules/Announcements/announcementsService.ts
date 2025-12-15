import { useState } from "react";
import axiosInstance from "../../context/axiosInstance";
import { Announcement, AnnouncementData } from "../../helper/typesHS";
import { toast } from "react-toastify";
import { handleError } from "../../helper/utils";
import Swal from "sweetalert2";

export const useAnnouncementsService = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const apiAnnouncement = {
        getAnnouncements: async () => {
            const { data } = await axiosInstance.get<AnnouncementData[]>(`/announcement/list-announcements`);
            return data;
        },
        updateAnnouncement: async (announcement: Announcement) => {
            const dataUpdate = { data: announcement }
            await axiosInstance.put(`announcement/update`, dataUpdate)
        },
        deleteAnnouncement: async (announcement: Announcement) => {
            await axiosInstance.delete(`announcement/delete`, {
                params: {
                    idAnnouncement: announcement.idAnnouncement
                }
            })
        }
    }

    const handleGetAnnouncements = async () => {
        setLoading(true);
        toast.info("Cargando anuncios... ⌛", { autoClose: 1000 });

        try {
            const announcements: AnnouncementData[] = await apiAnnouncement.getAnnouncements();
            toast.success("¡Anuncios cargados con éxito! 🎉", { autoClose: 1500 });
            console.log(announcements)
            return announcements;
        } catch (error) {
            handleError(error, "Error al consultar los anuncios");
        } finally { setLoading(false); }
    }

    const handleUpdateAnnouncement = async (announcement: Announcement) => {
        setLoading(true);
        toast.info("Actualizando anuncio... ⌛", { autoClose: 1000 });
        try {
            await apiAnnouncement.updateAnnouncement(announcement);
            toast.success("Anuncio actualizado con éxito! 🎉", { autoClose: 1500 });
        } catch (error) {
            handleError(error, "Error al actualizar el anuncio");
        } finally { setLoading(false); }
    }

    const handleDeleteAnnouncement = async (announcement: Announcement) => {
        setLoading(true);
        toast.info("Eliminando anuncio... ⌛", { autoClose: 1000 });
        try {
            await apiAnnouncement.deleteAnnouncement(announcement);
            toast.success("Anuncio eliminado con éxito! 🎉", { autoClose: 1500 });
            return announcement.idAnnouncement;
        } catch (error) {
            handleError(error, "Error al eliminar el anuncio");
        } finally { setLoading(false); }
    }

    const confirmUpdate = async (announcement: Announcement): Promise<boolean> => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas cambiar el estado del anuncio a ${announcement.status ? "Inactivo" : "Activo"}?`,
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Actualizar estado",
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            announcement.status = !announcement.status;
            handleUpdateAnnouncement(announcement);
            return true;
        }
        return false;
    }

    const confirmDelete = async (announcement: Announcement): Promise<string | undefined> => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas eliminar el anuncio?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Si, eliminar anuncio`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) return handleDeleteAnnouncement(announcement);
    }

    return {
        loading,
        handleGetAnnouncements,
        confirmDelete,
        confirmUpdate
    }
}