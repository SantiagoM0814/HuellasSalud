import { AuthContext, FormState, UserData, InputErrors, LoginRequest } from "../../helper/typesHS";
import { ChangeEvent, FormEvent, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import axiosInstance from "../../context/axiosInstance";

const MIN_CREDENTIAL_LENGTH: number = 8;
const DEFAULT_ERROR_MSG: string = "ㅤ";

export const useLoginService = (setLoading: (show: boolean) => void) => {

    const [viewPass, setViewPass] = useState<boolean>(false);
    const [validData, setValidData] = useState<boolean>(true);
    const [showEyePass, setShowEyePass] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>(DEFAULT_ERROR_MSG);
    const [formState, setFormState] = useState<FormState>({ inputEmailOrDoc: "", inputPassword: "" });
    const [inputErrors, setInputErrors] = useState<InputErrors>({ emailOrDoc: false, password: false });

    const emailOrDocRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const { id, value } = event.target;

        setFormState((prevState) => ({ ...prevState, [id]: value }));

        if (id === "inputPassword") {
            setShowEyePass(value.trim().length > 0);
            setInputErrors((prev) => ({ ...prev, password: false }));
        } else {
            setInputErrors((prev) => ({ ...prev, emailOrDoc: false }));
        }
    };

    const handleViewPassword = () => setViewPass(prev => !prev);

    const validateCredentials = (): boolean => {

        let isValid = true;
        const { inputPassword, inputEmailOrDoc } = formState;
        const newErrors: InputErrors = { emailOrDoc: false, password: false };

        if (inputEmailOrDoc.length < MIN_CREDENTIAL_LENGTH) {
            setErrorMsg("El correo o documento deben tener mínimo 8 caracteres");
            toast.warn("Los datos de correo o número de documento son incorrectos");
            newErrors.emailOrDoc = true;
            isValid = false;
            setTimeout(() => emailOrDocRef.current?.focus(), 0);
        } else if (inputPassword.length < MIN_CREDENTIAL_LENGTH) {
            setErrorMsg("La contraseña debe tener mínimo 8 caracteres");
            toast.warn("La contraseña ingresada es incorrecta");
            newErrors.password = true;
            isValid = false;
            setTimeout(() => passwordRef.current?.focus(), 0);
        }
        setValidData(isValid);
        setInputErrors(newErrors);

        return isValid;
    }

    const performLogin = async () => {

        toast.info("Enviando datos... ⏳", { autoClose: 1000 });

        const loginBody: LoginRequest = {
            data: {
                emailOrDoc: formState.inputEmailOrDoc,
                password: formState.inputPassword
            }
        }

        const { data } = await axiosInstance.post<UserData>("user/login", loginBody);

        login(data.token || "", data.data);

        toast.success(`¡Inicio de sesión exitoso! 🎉. Bienvenid@ ${data.data.name}`, { autoClose: 2000 });
        navigate("/", { replace: true });
    }

    const handleLoginError = (error: unknown) => {

        setValidData(false);
        setErrorMsg("Error en los datos suministrados");

        let errorMessage = "Error desconocido al iniciar sesión";

        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.title
                ? `${error.response.data.title}. ${error.response.data.detail || ''}`
                : error.message || 'Error en la comunicación con el servidor';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast.error(`${errorMessage} ❌`);
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        setLoading(true);

        if (!validateCredentials()) {
            setLoading(false);
            return;
        }

        try { await performLogin(); }
        catch (error) { handleLoginError(error); }
        finally { setLoading(false); }
    };

    return {
        handleSubmit,
        handleInputChange,
        handleViewPassword,
        formState,
        showEyePass,
        validData,
        errorMsg,
        viewPass,
        inputErrors,
        emailOrDocRef,
        passwordRef
    };
};
