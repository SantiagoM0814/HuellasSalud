import { useState } from "react";
import axiosInstance from "../../context/axiosInstance";
import { Appointment, AppointmentData, Schedule, ScheduleData, Service, ServiceData } from "../../helper/typesHS";
import { toast } from "react-toastify";
import { handleError } from "../../helper/utils";
import Swal from "sweetalert2";

export const useScheduleService = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const apiSchedule = {
        getSchedules: async () => {
            const { data } = await axiosInstance.get<ScheduleData[]>(`/schedule/list-schedules`);
            return data;
        },
        updateSchedule: async (schedule: Schedule) => {
            const dataUpdate = { data: schedule }
            await axiosInstance.put(`schedule/update`, dataUpdate)
        },
        deleteSchedule: async (schedule: Schedule) => {
            await axiosInstance.delete(`schedule/delete`, {
                params: {
                    idSchedule: schedule.idSchedule
                }
            })
        }
    }

    const handleGetSchedules = async () => {
        setLoading(true);
        toast.info("Cargando horarios... ⌛", { autoClose: 1000 });

        try {
            const schedules: ScheduleData[] = await apiSchedule.getSchedules();
            toast.success("¡Horarios cargados con éxito! 🎉", { autoClose: 1500 });
            console.log(schedules);
            return schedules;
        } catch (error) {
            handleError(error, "Error al consultar los horarios");
        } finally { setLoading(false); }
    }

    const handleUpdateSchedule = async (schedule: Schedule) => {
        setLoading(true);
        toast.info("Actualizando horario... ⌛", { autoClose: 1000 });
        try {
            await apiSchedule.updateSchedule(schedule);
            toast.success("Horario actualizado con éxito! 🎉", { autoClose: 1500 });
        } catch (error) {
            handleError(error, "Error al actualizar el horario");
        } finally { setLoading(false); }
    }

    const handleDeleteSchedule = async (schedule: Schedule) => {
        setLoading(true);
        toast.info("Eliminando horario... ⌛", { autoClose: 1000 });
        try {
            await apiSchedule.deleteSchedule(schedule);
            toast.success("Horario eliminado con éxito! 🎉", { autoClose: 1500 });
            return schedule.idSchedule;
        } catch (error) {
            handleError(error, "Error al eliminar el horario");
        } finally { setLoading(false); }
    }

    const confirmUpdate = async (schedule: Schedule): Promise<boolean> => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas cambiar el estado del horario del veterinario: ${schedule.idVeterinarian} a ${schedule.active ? "Inactivo" : "Activo"}?`,
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Actualizar estado horario",
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            schedule.active = !schedule.active;
            handleUpdateSchedule(schedule);
            return true;
        }
        return false;
    }

    const confirmDelete = async (schedule: Schedule): Promise<string | undefined> => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas eliminar el horario del veterinario: ${schedule.idVeterinarian}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Si, eliminar horario`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) return handleDeleteSchedule(schedule);
    }

    return {
        loading,
        handleGetSchedules,
        confirmDelete,
        confirmUpdate
    }
}