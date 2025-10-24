import { useState } from "react";
import axiosInstance from "../../context/axiosInstance";
import { Appointment, AppointmentData, Service, ServiceData } from "../../helper/typesHS";
import { toast } from "react-toastify";
import { handleError } from "../../helper/utils";
import Swal from "sweetalert2";

export const useAppointmentService = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const apiAppointment = {
        getAppointments: async () => {
            const { data } = await axiosInstance.get<AppointmentData[]>(`/appointment/list-appointments`);
            return data
        },
        getAppointmentAvailable: async (date: string, idVeterinarian: string) => {
            const { data } = await axiosInstance.get('/appointment/available', {
                params: {
                    date: date,
                    idVeterinarian: idVeterinarian
                }
            });
            return data ;
        },
        updateAppointment: async (appointment: Appointment) => {
            const dataUpdate = { data: appointment }
            await axiosInstance.put(`appointment/update`, dataUpdate)
        },
        deleteAppointment: async (appointment: Appointment) => {
            await axiosInstance.delete(`appointment/delete`, {
                params: {
                    idAppointment: appointment.idAppointment
                }
            })
        }
    }

    const handleGetAppointments = async () => {
        setLoading(true);
        toast.info("Cargando registros... ⌛", { autoClose: 1000 });

        try {
            const appointments: AppointmentData[] = await apiAppointment.getAppointments();
            toast.success("¡Registros cargados con éxito! 🎉", { autoClose: 1500 });
            return appointments;
        } catch (error) {
            handleError(error, "Error al consultar las citas");
        } finally { setLoading(false); }
    }

    const handleGetAppointmentAvailable = async (date: string, idVeterinarian: string) => {
        setLoading(true);
        toast.info("Cargando horarios disponibles... ⌛", { autoClose: 1000 });

        try {
            const response = await apiAppointment.getAppointmentAvailable(date, idVeterinarian);
            toast.success("Horarios cargados con éxito! 🎉", { autoClose: 1500 });
            return response;
        } catch (error) {
            handleError(error, "Error al consultar los horarios");
        } finally { setLoading(false); }
    }

    const handleUpdateAppointment = async (appointment: Appointment) => {
        setLoading(true);
        toast.info("Actualizando cita... ⌛", { autoClose: 1000 });
        try {
            await apiAppointment.updateAppointment(appointment);
            toast.success("Cita actualizada con éxito! 🎉", { autoClose: 1500 });
        } catch (error) {
            handleError(error, "Error al actualizar la cita");
        } finally { setLoading(false); }
    }

    const handleDeleteAppointment = async (appointment: Appointment) => {
        setLoading(true);
        toast.info("Eliminando cita... ⌛", { autoClose: 1000 });
        try {
            await apiAppointment.deleteAppointment(appointment);
            toast.success("Cita eliminada con éxito! 🎉", { autoClose: 1500 });
            return appointment.idAppointment;
        } catch (error) {
            handleError(error, "Error al eliminar la cita");
        } finally { setLoading(false); }
    }

    // const confirmUpdate = async (appointment: Appointment): Promise<boolean> => {
    //     const result = await Swal.fire({
    //         title: "¿Estás seguro?",
    //         text: `¿Deseas cambiar el estado de la cita a ${appointment.status ? "Inactivo" : "Activo"}?`,
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: "#3085d6",
    //         cancelButtonColor: "#d33",
    //         confirmButtonText: `Actualizar estado de la cita`,
    //         cancelButtonText: "Cancelar",
    //     });
    //     if (result.isConfirmed) {
    //         appointment.status = !appointment.status;
    //         handleUpdateService(service);
    //         return true;
    //     }
    //     return false;
    // }

    const confirmDelete = async (appointment: Appointment): Promise<string | undefined> => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas eliminar la cita: ${appointment.idPet}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Si, eliminar cita`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) return handleDeleteAppointment(appointment);
    }

    return {
        loading,
        handleGetAppointments,
        handleGetAppointmentAvailable,
        confirmDelete
    }
}