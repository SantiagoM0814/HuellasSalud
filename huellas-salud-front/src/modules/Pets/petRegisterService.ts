import { ChangeEvent, useEffect, useRef, useState } from "react";
import { set, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CreatePetModalProps, MediaFile, Pet, PetData } from "../../helper/typesHS";
import axiosInstance from "../../context/axiosInstance";
import axios from "axios";
import Swal from "sweetalert2";

export const usePetRegister = ({ setModalCreatePet, setPetsData, petSelected }: CreatePetModalProps) => {
    const fileInput = useRef<HTMLInputElement>(null);

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [previewImg, setPreviewImg] = useState<string | undefined>();
    const [fileName, setFileName] = useState<string>("Cargar imagen de la mascota");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<Pet>({ defaultValues: { isActive: true } })

    useEffect(() => {
        if (petSelected?.data.mediaFile) {
            setPreviewImg(`data:${petSelected.data.mediaFile.contentType};base64,${petSelected.data.mediaFile.attachment}`); // Base64 si lo tienes
            setFileName(petSelected.data.mediaFile.fileName);
        }
        if (petSelected?.data) {
            reset(petSelected.data);
        }
    }, [petSelected, reset]);


    const createPet = async (petData: Pet) => {
        const payload = { data: petData };

        toast.info(`Creando registro de la mascota ${petData.name.toUpperCase()}... ⌛`, { autoClose: 1200 });

        const file = fileInput.current?.files?.[0];
        const { data: createdPet } = await axiosInstance.post<PetData>("pet/create", payload);

        if (file && createdPet?.data?.idPet) {

            const formData = new FormData();
            formData.append("file", file);

            try {
                const { data: mediaFile } = await axiosInstance.post<MediaFile>(
                    `/avatar-user/PET/${createdPet.data.idPet}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                createdPet.data.mediaFile = mediaFile;
            } catch (err) {
                toast.error("Mascota creada, pero falló el envío de imagen");
            }
        }

        setPetsData && setPetsData(prev => [...(prev ?? []), createdPet]);
        return createdPet;
    };

    const handleError = (error: unknown) => {
        setErrorMsg("Error en servicio de creación de mascota");
        let errorMessage = "Error desconocido al crear mascota nueva";

        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.title
                ? `${error.response.data.title}. ${error.response.data.detail || ''}`
                : error.message || 'Error en la comunicación con el servidor';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast.error(`${errorMessage} ❌`);
    }

    const onSubmit = async (pet: Pet) => {
        const file = fileInput.current?.files?.[0];
        if (!file) {
            toast.error("¡Debe subir una imagen de la mascota!");
            return;
        }

        setLoading(true);

        try {
            await createPet(pet);
            toast.success("¡Mascota registrada con éxito! 🎉");
            setErrorMsg("");
            reset();
            setModalCreatePet && setModalCreatePet(false);
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

    const handleUpdatePet = async (pet: Pet) => {
        const payload = { data: pet };
        setLoading(true);
        toast.info("Actualizando mascota... ⌛", { autoClose: 1000 });

        try {
            const file = fileInput.current?.files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                try {
                    await axiosInstance.put<MediaFile>(
                        `/avatar-user/update/PET/${payload.data.idPet}`,
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );
                } catch (err) {
                    toast.error("Mascota actualizada, pero falló el envío de imagen");
                }
            }
            const { data: petUpdated } = await axiosInstance.put(`/pet/update`, payload); // 204 NO CONTENT

            // ✅ Si hay imagen seleccionada, actualiza mediaFile
            console.log(petUpdated) 
            setPetsData &&
                setPetsData(prev =>
                    prev?.map(p =>
                        p.data.idPet === petUpdated.data.idPet ? petUpdated : p
                    )
                );

            toast.success("¡Mascota actualizada con éxito! 🎉", { autoClose: 1500 });
            setModalCreatePet && setModalCreatePet(false);
            return payload.data;
        } catch (error) {
            handleError("Error al actualizar la mascota");
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const confirmUpdate = async (pet: Pet): Promise<boolean> => {
        console.log(pet);
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas actualizar la mascota ${pet.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Actualizar mascota`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            handleUpdatePet(pet);
            return true;
        }
        return false;
    }


    return {
        confirmUpdate,
        errorMsg,
        handleCreatePetSubmit: onSubmit,
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
