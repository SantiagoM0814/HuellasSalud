import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Appointment, AppointmentData, CreateAppointmentModalProps } from "../../helper/typesHS";
import axiosInstance from "../../context/axiosInstance";
import axios from "axios";
import Swal from "sweetalert2";

export const useAppointmentRegister = ({ setModalAppointment, setAppointmentsData, appointmentSelected }: CreateAppointmentModalProps) => {

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<Appointment>({ defaultValues: { status: "PENDIENTE" } })

    useEffect(() => {
        if (appointmentSelected?.data) {
            reset(appointmentSelected.data);
        }
    }, [appointmentSelected, reset]);


    const createAppointment = async (appointmentData: Appointment) => {
        const payload = { data: appointmentData };
        console.log(payload)
        toast.info(`Creando registro de la cita ${appointmentData.idPet.toUpperCase()}... ⌛`, { autoClose: 1200 });

        const { data: createdAppointment } = await axiosInstance.post<AppointmentData>("appointment/create", payload);

        setAppointmentsData && setAppointmentsData(prev => [...(prev ?? []), createdAppointment]);
        return createdAppointment;
    };

    const handleError = (error: unknown) => {
        setErrorMsg("Error en servicio de creación de cita");
        let errorMessage = "Error desconocido al crear cita nueva";

        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.title
                ? `${error.response.data.title}. ${error.response.data.detail || ''}`
                : error.message || 'Error en la comunicación con el servidor';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast.error(`${errorMessage} ❌`);
    }

    const onSubmit = async (appointment: Appointment) => {
        setLoading(true);

        try {
            const { date, hour, ...rest } = appointment;

            if (!date || !hour) {
                toast.error("Debe seleccionar una fecha y hora válidas ⏰");
                setLoading(false);
                return;
            }

            const dateTime = `${date}T${hour}:00`;

            console.log(hour);

            const appointmentData: Appointment = {
                ...rest,
                dateTime,
                services: Array.isArray(appointment.services)
                    ? appointment.services
                    : [appointment.services],
            };
            await createAppointment(appointmentData);
            toast.success("Cita registrada con éxito! 🎉");
            setErrorMsg("");
            reset();
            setModalAppointment && setModalAppointment(false);
        } catch (error) { handleError(error); }
        finally { setLoading(false); }
    }

    const handleUpdateAppointment = async (appointment: Appointment) => {
        const payload = { data: appointment };
        setLoading(true);
        toast.info("Actualizando cita... ⌛", { autoClose: 1000 });

        try {
            const { data: appointmentUpdated } = await axiosInstance.put(`/appointment/update`, payload);

            setAppointmentsData &&
                setAppointmentsData(prev =>
                    prev?.map(s =>
                        s.data.idAppointment === appointmentUpdated.data.idAppointment ? appointmentUpdated : s
                    )
                );

            toast.success("Cita actualizada con éxito! 🎉", { autoClose: 1500 });
            setModalAppointment && setModalAppointment(false);
            return payload.data;
        } catch (error) {
            handleError("Error al actualizar la cita");
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const confirmUpdate = async (appointment: Appointment): Promise<boolean> => {
        const { date, hour, ...rest } = appointment;

        const dateTime = `${date}T${hour}:00`;

        console.log(hour);

        const appointmentData: Appointment = {
            ...rest,
            dateTime,
            services: Array.isArray(appointment.services)
                ? appointment.services
                : [appointment.services],
        };
        if (
            appointmentSelected?.data &&
            JSON.stringify(appointmentSelected.data) === JSON.stringify(appointmentData)
        ) {
            toast.info("No realizaste ningún cambio en la cita.");
            return false;
        }

        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas actualizar la cita ${appointment.idPet}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Actualizar Cita`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            handleUpdateAppointment(appointmentData);
            return true;
        }
        return false;
    }


    return {
        confirmUpdate,
        errorMsg,
        handleCreateAppointmentSubmit: onSubmit,
        loading,
        register,
        errors,
        handleSubmit,
        setValue,
        watch,
        reset
    }
}