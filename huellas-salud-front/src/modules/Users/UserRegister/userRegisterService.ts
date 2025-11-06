import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CreateUserModalProps, MediaFile, User, UserData } from "../../../helper/typesHS";
import axiosInstance from "../../../context/axiosInstance";
import axios from "axios";
import Swal from "sweetalert2";

export const useUserRegister = ({ setModalCreate, setUsersData, userSelected }: CreateUserModalProps) => {

    const fileInput = useRef<HTMLInputElement>(null);

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [previewImg, setPreviewImg] = useState<string | undefined>();
    const [fileName, setFileName] = useState<string>("Cargar imagen de perfil");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<User>({ defaultValues: { role: "CLIENTE" } });

    useEffect(() => {
        if (userSelected?.data.mediaFile) {
            setPreviewImg(`data:${userSelected.data.mediaFile.contentType};base64,${userSelected.data.mediaFile.attachment}`); // Base64 si lo tienes
            setFileName(userSelected.data.mediaFile.fileName);
        }
        console.log(userSelected);
        if (userSelected?.data) {
            const normalizePhone = (value: string) => {
                const clean = value.replace(/[^0-9]/g, '');

                return clean.startsWith('57') ? clean.slice(2) : clean;
            };


            reset({
                ...userSelected.data,
                cellPhone: normalizePhone(userSelected.data.cellPhone || '')
            });
        }
    }, [userSelected, reset]);

    const formatPhoneNumber = (phoneNumber: string): string => {
        const digits = phoneNumber.replace(/\D/g, '');

        if (digits.length === 7) return `60-1-${digits}`;
        if (digits.length === 10) return `57-3-${digits.substring(1)}`;
        return `57-3-${digits.substring(1).padEnd(9, '0')}`;
    }

    const createUser = async (userData: User) => {

        const formattedUser = {
            ...userData,
            cellPhone: formatPhoneNumber(userData.cellPhone)
        }

        const payload = { data: formattedUser };

        toast.info(`Creando registro del usuario ${formattedUser.lastName.toUpperCase()}... ⏳`, { autoClose: 1200 });

        const file = fileInput.current?.files?.[0];
        const { data: createdUser } = await axiosInstance.post<UserData>("user/register", payload);

        if (file && createdUser?.data?.documentNumber) {

            const formData = new FormData();
            formData.append("file", file);

            try {
                const { data: mediaFile } = await axiosInstance.post<MediaFile>(
                    `/avatar-user/USER/${createdUser.data.documentNumber}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                createdUser.data.mediaFile = mediaFile;
            } catch (err) {
                toast.error("Usuario creado, pero falló el envío de imagen");
            }
        }

        setUsersData && setUsersData(prev => [...(prev ?? []), createdUser]);
        return createdUser;
    };

    const handleError = (error: unknown) => {

        setErrorMsg("Error en servicio de creación de usuario");

        let errorMessage = "Error desconocido al crear usuario nuevo";

        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.title
                ? `${error.response.data.title}. ${error.response.data.detail || ''}`
                : error.message || 'Error en la comunicación con el servidor';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast.error(`${errorMessage} ❌`);
    }

    const onSubmit = async (user: User) => {

        setLoading(true);

        try {
            await createUser(user);
            toast.success("¡Usuario registrado con éxito! 🎉");
            setErrorMsg("");
            setPreviewImg(undefined);
            setFileName("Cargar imagen de perfil");
            reset();
            setModalCreate && setModalCreate(false);
        } catch (error) { handleError(error); }
        finally { setLoading(false); }
    };

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

    const handleUpdateUser = async (user: User) => {
        const payload = { data: user };
        console.log(payload);
        setLoading(true);
        toast.info("Actualizando perfil... ⌛", { autoClose: 1000 });

        try {
            const file = fileInput.current?.files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                try {
                    await axiosInstance.get(`/avatar-user/USER/${payload.data.documentNumber}`);

                    await axiosInstance.put(
                        `/avatar-user/update/USER/${payload.data.documentNumber}`,
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );
                } catch (error: any) {
                    if (error.response?.status === 404) {
                        await axiosInstance.post(
                            `/avatar-user/USER/${payload.data.documentNumber}`,
                            formData,
                            { headers: { "Content-Type": "multipart/form-data" } }
                        );
                    } else {
                        toast.error("Perfil actualizado, pero falló el envío de imagen");
                    }
                }
            }
            const { data: userUpdate} =await axiosInstance.put(`/user/update`, payload);

            setUsersData &&
                setUsersData(prev =>
                    prev?.map(u =>
                        u.data.documentNumber === userUpdate.data.documentNumber ? userUpdate : u
                    )
                );

            localStorage.setItem("userData", JSON.stringify(userUpdate.data));
            window.dispatchEvent(new Event("userDataUpdated"));


            toast.success("Perfil actualizado con éxito! 🎉", { autoClose: 1500 });
            setModalCreate && setModalCreate(false);
            return payload.data;
        } catch (error) {
            handleError("Error al actualizar el perfil");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const confirmUpdate = async (user: User): Promise<boolean> => {
        const formattedUser = {
            ...user,
            cellPhone: formatPhoneNumber(user.cellPhone)
        }
        const file = fileInput.current?.files?.[0];

        if (
            userSelected?.data &&
            JSON.stringify(userSelected.data) === JSON.stringify(formattedUser) &&
            !file
        ) {
            toast.info("No realizaste ningún cambio en el perfil.");
            return false;
        }

        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas actualizar el perfil ${formattedUser.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Actualizar Perfil`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            handleUpdateUser(formattedUser);
            return true;
        }
        return false;
    }

    return {
        errorMsg,
        handleCreateUserSubmit: onSubmit,
        loading,
        register,
        errors,
        handleSubmit,
        fileName,
        fileInput,
        previewImg,
        handleChangeImg,
        confirmUpdate
    };
}
