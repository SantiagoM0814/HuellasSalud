import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CreateScheduleModalProps, Schedule, ScheduleData } from "../../helper/typesHS";
import axiosInstance from "../../context/axiosInstance";
import axios from "axios";
import Swal from "sweetalert2";

export const useScheduleRegister = ({ setModalSchedule, setSchedulesData, scheduleSelected }: CreateScheduleModalProps) => {

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<Schedule>({ defaultValues: { active: true } })

    useEffect(() => {
        if (scheduleSelected?.data) {
            reset(scheduleSelected.data);
        }
    }, [scheduleSelected, reset]);


    const createSchedule = async (scheduleData: Schedule) => {
        const payload = { data: scheduleData };
        toast.info(`Creando registro del horario para el veterinario ${scheduleData.idVeterinarian}... ⌛`, { autoClose: 1200 });

        const { data: createdSchedule } = await axiosInstance.post<ScheduleData>("schedule/create", payload);

        setSchedulesData && setSchedulesData(prev => [...(prev ?? []), createdSchedule]);
        return createdSchedule;
    };

    const handleError = (error: unknown) => {
        setErrorMsg("Error en servicio de creación del horario");
        let errorMessage = "Error desconocido al crear horario nuevo";

        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.title
                ? `${error.response.data.title}. ${error.response.data.detail || ''}`
                : error.message || 'Error en la comunicación con el servidor';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast.error(`${errorMessage} ❌`);
    }

    const onSubmit = async (schedule: Schedule) => {
        setLoading(true);

        try {
            await createSchedule(schedule);
            toast.success("Horario registrado con éxito! 🎉");
            setErrorMsg("");
            reset();
            setModalSchedule && setModalSchedule(false);
        } catch (error) { handleError(error); }
        finally { setLoading(false); }
    }

    const handleUpdateSchedule = async (schedule: Schedule) => {
        const payload = { data: schedule };
        setLoading(true);
        toast.info("Actualizando horario... ⌛", { autoClose: 1000 });

        try {
            const { data: scheduleUpdated } = await axiosInstance.put(`/schedule/update`, payload);

            setSchedulesData &&
                setSchedulesData(prev =>
                    prev?.map(s =>
                        s.data.idSchedule === scheduleUpdated.data.idSchedule ? scheduleUpdated : s
                    )
                );

            toast.success("Horario actualizado con éxito! 🎉", { autoClose: 1500 });
            setModalSchedule && setModalSchedule(false);
            return payload.data;
        } catch (error) {
            handleError("Error al actualizar el horario");
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const confirmUpdate = async (schedule: Schedule): Promise<boolean> => {
        if (
            scheduleSelected?.data &&
            JSON.stringify(scheduleSelected.data) === JSON.stringify(schedule)
        ) {
            toast.info("No realizaste ningún cambio en el horario.");
            return false;
        }

        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas actualizar el horario del veterinario ${schedule.idVeterinarian}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Actualizar Horario`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            handleUpdateSchedule(schedule);
            return true;
        }
        return false;
    }


    return {
        confirmUpdate,
        errorMsg,
        handleCreateScheduleSubmit: onSubmit,
        loading,
        register,
        errors,
        handleSubmit,
        setValue,
        watch,
        reset
    }
}