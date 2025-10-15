import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CreateServiceModalProps, MediaFile, Service, ServiceData } from "../../helper/typesHS";
import axiosInstance from "../../context/axiosInstance";
import axios from "axios";
import Swal from "sweetalert2";

export const useServiceRegister = ({ setModalService, setServicesData, serviceSelected }: CreateServiceModalProps) => {
    const fileInput = useRef<HTMLInputElement>(null);

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [previewImg, setPreviewImg] = useState<string | undefined>();
    const [fileName, setFileName] = useState<string>("Cargar imagen del servicio");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<Service>({ defaultValues: { state: true } })

    useEffect(() => {
        if (serviceSelected?.data.mediaFile) {
            setPreviewImg(`data:${serviceSelected.data.mediaFile.contentType};base64,${serviceSelected.data.mediaFile.attachment}`);
            setFileName(serviceSelected.data.mediaFile.fileName);
        }
        if (serviceSelected?.data) {
            reset(serviceSelected.data);
        }
    }, [serviceSelected, reset]);


    const createService = async (serviceData: Service) => {
        const payload = { data: serviceData };
        toast.info(`Creando registro del servicio ${serviceData.name.toUpperCase()}... ⌛`, { autoClose: 1200 });

        const file = fileInput.current?.files?.[0];
        const { data: createdService } = await axiosInstance.post<ServiceData>("service/create", payload);

        if (file && createdService?.data?.idService) {

            const formData = new FormData();
            formData.append("file", file);

            try {
                const { data: mediaFile } = await axiosInstance.post<MediaFile>(
                    `/avatar-user/SERVICE/${createdService.data.idService}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                createdService.data.mediaFile = mediaFile;
            } catch (err) {
                toast.error("Servicio creado, pero falló el envío de imagen");
            }
        }

        setServicesData && setServicesData(prev => [...(prev ?? []), createdService]);
        return createdService;
    };

    const handleError = (error: unknown) => {
        setErrorMsg("Error en servicio de creación de servicio");
        let errorMessage = "Error desconocido al crear servicio nuevo";

        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.title
                ? `${error.response.data.title}. ${error.response.data.detail || ''}`
                : error.message || 'Error en la comunicación con el servidor';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast.error(`${errorMessage} ❌`);
    }

    const onSubmit = async (service: Service) => {
        const file = fileInput.current?.files?.[0];
        if (!file) {
            toast.error("¡Debe subir una imagen del servicio!");
            return;
        }

        setLoading(true);

        try {
            await createService(service);
            toast.success("Servicio registrado con éxito! 🎉");
            setErrorMsg("");
            reset();
            setModalService && setModalService(false);
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

    const handleUpdateService = async (service: Service) => {
        const payload = { data: service };
        setLoading(true);
        toast.info("Actualizando servicio... ⌛", { autoClose: 1000 });

        try {
            const file = fileInput.current?.files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                try {
                    await axiosInstance.get(`/avatar-user/SERVICE/${payload.data.idService}`);

                    await axiosInstance.put(
                        `/avatar-user/update/SERVICE/${payload.data.idService}`,
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );
                } catch (error: any) {
                    if (error.response?.status === 404) {
                        await axiosInstance.post(
                            `/avatar-user/SERVICE/${payload.data.idService}`,
                            formData,
                            { headers: { "Content-Type": "multipart/form-data" } }
                        );
                    } else {
                        toast.error("Servicio actualizado, pero falló el envío de imagen");
                    }
                }
            }
            const { data: serviceUpdated } = await axiosInstance.put(`/service/update`, payload);

            setServicesData &&
                setServicesData(prev =>
                    prev?.map(s =>
                        s.data.idService === serviceUpdated.data.idService ? serviceUpdated : s
                    )
                );

            toast.success("Servicio actualizado con éxito! 🎉", { autoClose: 1500 });
            setModalService && setModalService(false);
            return payload.data;
        } catch (error) {
            handleError("Error al actualizar el servicio");
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const confirmUpdate = async (service: Service): Promise<boolean> => {
        const file = fileInput.current?.files?.[0];

        if (
            serviceSelected?.data &&
            JSON.stringify(serviceSelected.data) === JSON.stringify(service) &&
            !file
        ) {
            toast.info("No realizaste ningún cambio en el servicio.");
            return false;
        }

        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas actualizar el servicio ${service.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Actualizar Servicio`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            handleUpdateService(service);
            return true;
        }
        return false;
    }


    return {
        confirmUpdate,
        errorMsg,
        handleCreateServiceSubmit: onSubmit,
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