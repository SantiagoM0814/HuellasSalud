import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../context/axiosInstance";
import axios from "axios";

export const usePassRecService = () => {

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [inputEmail, setInputEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [validData, setValidData] = useState<boolean>(true);
    const [validatingCode, setValidatingCode] = useState<boolean>(true);

    const navigate = useNavigate();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setInputEmail(event.target.value);

    const validateEmail = (): boolean => {
        let isValid = true;
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(inputEmail)) {
            setErrorMsg("El correo electrónico ingresado es inválido");
            toast.warn("Los datos de correo electrónico son incorrectos");
            isValid = false;
        }
        setValidData(isValid);
        return isValid;
    };

    const validatePassword = (): boolean => {
        if (password.length < 8) {
            setErrorMsg("La contraseña debe tener al menos 8 caracteres");
            toast.warn("La contraseña es demasiado corta");
            return false;
        }
        if (password !== confirmPassword) {
            setErrorMsg("Las contraseñas no coinciden");
            toast.warn("Las contraseñas no coinciden");
            return false;
        }
        return true;
    }

    const performPassRecovery = async () => {
        toast.info("Enviando datos... ⏳", { autoClose: 1000 });
        await axiosInstance.get(`/password-recovery/${inputEmail}`);
        toast.success(`¡Recuperación exitosa! 🎉. Se ha enviado un correo a ${inputEmail}`, { autoClose: 2000 });
        navigate("/", { replace: true });
    };

    const performPassReset = async () => {
        toast.info("Enviando datos... ⏳", { autoClose: 1000 });

        const updatePassBody = {
            data: {
                newPassword: password,
                approvalCode: new URLSearchParams(window.location.search).get("approvalCode")
            }
        }

        await axiosInstance.put(`/user/update-password`, updatePassBody);
        toast.success(`¡Cambio exitoso! 🎉. La contraseña se cambio correctamente`, { autoClose: 2000 });
        navigate("/login", { replace: true });
    }

    const performTokenValidation = async () => {
        toast.info("Validando datos... ⏳", { autoClose: 1000 });
        await axiosInstance.put(`/validate-token/${new URLSearchParams(window.location.search).get("approvalCode")}`);
        toast.success("Código válido! 🎉. Puedes cambiar tu contraseña", { autoClose: 2000 });
    }

    const handlePassRecoveryError = (error: unknown) => {

        setValidData(false);
        setErrorMsg("Error en servicio de recuperación de contraseña");

        let errorMessage = "Error en servicio de recuperación de contraseña";

        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.title
                ? `${error.response.data.title}. ${error.response.data.detail || ''}`
                : error.message || 'Error en la comunicación con el servidor';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast.error(`${errorMessage} ❌`);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!validateEmail()) {
            setLoading(false);
            return;
        }

        try { await performPassRecovery(); }
        catch (error) { handlePassRecoveryError(error); }
        finally { setLoading(false); }
    };

    const handleSubmitReset = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!validatePassword()) {
            setValidData(false);
            setLoading(false);
            return;
        }

        try { await performPassReset(); }
        catch (error) { handlePassRecoveryError(error); }
        finally { setLoading(false); }
    }

    const handleValidateToken = async () => {      
        setValidatingCode(true);  

        try {
            await performTokenValidation();
        } catch (error) {
            handlePassRecoveryError(error);
            navigate("/login", { replace: true });
        } finally {
            setTimeout(() => { setValidatingCode(false); }, 800);
        }
    }

    return {
        errorMsg,
        loading,
        validatingCode,
        inputEmail,
        validData,
        setPassword,
        setConfirmPassword,
        handleInputChange,
        handleSubmit,
        handleSubmitReset,
        handleValidateToken
    };
}