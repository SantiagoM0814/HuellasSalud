import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Announcement, AnnouncementData, CreateAnnouncementModalProps, MediaFile } from "../../helper/typesHS";
import axiosInstance from "../../context/axiosInstance";
import axios from "axios";
import Swal from "sweetalert2";

export const useAnnouncementRegister = ({ setModalCreateAnnouncement, setAnnouncementsData, announcementSelected }: CreateAnnouncementModalProps) => {
    const fileInput = useRef<HTMLInputElement>(null);

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [previewImg, setPreviewImg] = useState<string | undefined>();
    const [fileName, setFileName] = useState<string>("Cargar imagen del anuncio");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<Announcement>({ defaultValues: { status: true } })

    useEffect(() => {
        if (announcementSelected?.data.mediaFile) {
            setPreviewImg(`data:${announcementSelected.data.mediaFile.contentType};base64,${announcementSelected.data.mediaFile.attachment}`);
            setFileName(announcementSelected.data.mediaFile.fileName);
        }
        if (announcementSelected?.data) {
            const normalizePhone = (value: string) => {
                const clean = value.replace(/[^0-9]/g, '');

                return clean.startsWith('57') ? clean.slice(2) : clean;
            };


            reset({
                ...announcementSelected.data,
                cellPhone: normalizePhone(announcementSelected.data.cellPhone || '')
            });
        }
    }, [announcementSelected, reset]);

    const formatPhoneNumber = (phoneNumber: string): string => {
        const digits = phoneNumber.replace(/\D/g, '');

        if (digits.length === 7) return `60-1-${digits}`;
        if (digits.length === 10) return `57-3-${digits.substring(1)}`;
        return `57-3-${digits.substring(1).padEnd(9, '0')}`;
    }

    const createAnnouncement = async (announcementData: Announcement) => {
        const formattedAnnouncement = {
            ...announcementData,
            cellPhone: formatPhoneNumber(announcementData.cellPhone)
        }
        const payload = { data: formattedAnnouncement };

        toast.info(`Creando registro del anuncio... ⌛`, { autoClose: 1200 });

        const file = fileInput.current?.files?.[0];
        const { data: createdAnnouncement } = await axiosInstance.post<AnnouncementData>("announcement/create", payload);

        if (file && createdAnnouncement?.data?.idAnnouncement) {

            const formData = new FormData();
            formData.append("file", file);

            try {
                const { data: mediaFile } = await axiosInstance.post<MediaFile>(
                    `/avatar-user/ANNOUNCEMENT/${createdAnnouncement.data.idAnnouncement}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                createdAnnouncement.data.mediaFile = mediaFile;
            } catch (err) {
                toast.error("Anuncio creado, pero falló el envío de imagen");
            }
        }

        setAnnouncementsData && setAnnouncementsData(prev => [...(prev ?? []), createdAnnouncement]);
        return createdAnnouncement;
    };

    const handleError = (error: unknown) => {
        setErrorMsg("Error en servicio de creación de anuncio");
        let errorMessage = "Error desconocido al crear anuncio nuevo";

        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.title
                ? `${error.response.data.title}. ${error.response.data.detail || ''}`
                : error.message || 'Error en la comunicación con el servidor';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast.error(`${errorMessage} ❌`);
    }

    const onSubmit = async (announcement: Announcement) => {
        const file = fileInput.current?.files?.[0];
        if (!file) {
            toast.error("¡Debe subir una imagen del anuncio!");
            return;
        }

        setLoading(true);

        try {
            await createAnnouncement(announcement);
            toast.success("Anuncio registrado con éxito! 🎉");
            setErrorMsg("");
            reset();
            setModalCreateAnnouncement && setModalCreateAnnouncement(false);
        } catch (error) { handleError(error); }
        finally { setLoading(false); }
    }

    const handleChangeImg = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const maxSize = 4 * 1024 * 1024;
        const validTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!validTypes.includes(file.type)) {
            toast.info('Sólo se permiten imágenes en formato JPG, PNG o WEBP');
            return;
        }

        if (file.size > maxSize) {
            toast.error('La imagen no debe pesar más de 4 MB');
            return;
        }

        setPreviewImg(URL.createObjectURL(file));
        setFileName(file.name);
    }

    const handleUpdateAnnouncement = async (announcement: Announcement) => {
        const payload = { data: announcement };
        setLoading(true);
        toast.info("Actualizando anuncio... ⌛", { autoClose: 1000 });

        try {
            const file = fileInput.current?.files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                try {
                    await axiosInstance.get(`/avatar-user/ANNOUNCEMENT/${payload.data.idAnnouncement}`);

                    await axiosInstance.put(
                        `/avatar-user/update/ANNOUNCEMENT/${payload.data.idAnnouncement}`,
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );
                } catch (error: any) {
                    if (error.response?.status === 404) {
                        await axiosInstance.post(
                            `/avatar-user/ANNOUNCEMENT/${payload.data.idAnnouncement}`,
                            formData,
                            { headers: { "Content-Type": "multipart/form-data" } }
                        );
                    } else {
                        toast.error("Anuncio actualizado, pero falló el envío de imagen");
                    }
                }
            }
            const { data: announcementUpdated } = await axiosInstance.put(`/announcement/update`, payload);

            setAnnouncementsData &&
                setAnnouncementsData(prev =>
                    prev?.map(p =>
                        p.data.idAnnouncement === announcementUpdated.data.idAnnouncement ? announcementUpdated : p
                    )
                );

            toast.success("¡Anuncio actualizado con éxito! 🎉", { autoClose: 1500 });
            setModalCreateAnnouncement && setModalCreateAnnouncement(false);
            return payload.data;
        } catch (error) {
            handleError("Error al actualizar el anuncio");
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const confirmUpdate = async (announcement: Announcement): Promise<boolean> => {
        const formattedAnnouncement = {
            ...announcement,
            cellPhone: formatPhoneNumber(announcement.cellPhone)
        }

        const file = fileInput.current?.files?.[0];

        if (
            announcementSelected?.data &&
            JSON.stringify(announcementSelected.data) === JSON.stringify(formattedAnnouncement) &&
            !file
        ) {
            toast.info("No realizaste ningún cambio en el anuncio");
            return false;
        }

        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas actualizar el anuncio?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Actualizar anuncio`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            handleUpdateAnnouncement(formattedAnnouncement);
            return true;
        }
        return false;
    }


    return {
        confirmUpdate,
        errorMsg,
        handleCreateAnnouncementSubmit: onSubmit,
        loading,
        register,
        errors,
        handleSubmit,
        fileName,
        fileInput,
        previewImg,
        handleChangeImg,
        reset
    }
}