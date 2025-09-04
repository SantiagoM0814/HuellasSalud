import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { InputFieldProps, LoginFormProps, PasswordFieldProps } from "../../helper/typesHS";
import { useLoginService } from "./loginService";
import styles from "./login.module.css";
import logoGoogle from "../../assets/logoGoogleG.png";
import ButtonComponent from "../../components/Button/Button";

export const LoginForm = ({ loading, setLoading }: LoginFormProps) => {

    const {
        handleSubmit,
        handleInputChange,
        viewPass,
        handleViewPassword,
        showEyePass,
        validData,
        errorMsg,
        inputErrors,
        emailOrDocRef,
        passwordRef,
    } = useLoginService(setLoading);

    return (
        <form className={styles.formLogin} onSubmit={handleSubmit}>
            <InputField
                handleInputChange={handleInputChange}
                hasError={inputErrors.emailOrDoc}
                ref={emailOrDocRef}
            />
            <PasswordField
                viewPass={viewPass}
                setViewPass={handleViewPassword}
                showEyePass={showEyePass}
                errorMsg={errorMsg}
                handleInputChange={handleInputChange}
                validData={validData}
                hasError={inputErrors.password}
                ref={passwordRef}
            />
            <ButtonComponent type="submit" contain={"INGRESAR"} loading={loading} />
        </form>
    );
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ handleInputChange, hasError }, ref) => {
        return (
            <aside className={styles.inputContainer} >
                <label htmlFor="inputEmailOrDoc" className={styles.loginLabel}>
                    Correo o número de documento
                </label>
                <input
                    id="inputEmailOrDoc"
                    onChange={handleInputChange}
                    className={`${styles.loginInput} ${hasError ? styles.errorInput : ""}`}
                    type="text"
                    required
                    ref={ref}
                />
            </aside>
        );
    }
);

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
    (
        {
            viewPass,
            setViewPass,
            showEyePass,
            errorMsg,
            handleInputChange,
            validData,
            hasError,
        },
        ref
    ) => {
        return (
            <aside className={styles.inputContainer} >
                <label htmlFor="inputPassword" className={styles.loginLabel}>
                    Contraseña
                </label>
                <input
                    id="inputPassword"
                    onChange={handleInputChange}
                    className={`${styles.loginInput} ${styles.inputPass} ${hasError ? styles.errorInput : ""
                        }`}
                    type={viewPass ? "text" : "password"}
                    required
                    ref={ref}
                />
                <button
                    type="button"
                    onClick={() => setViewPass?.((prev) => !prev)}
                    className={`${styles.iconEye} ${!showEyePass && styles.eyeDesable}`}
                    aria-label="Mostrar/Ocultar contraseña"
                >
                    <i className={`fa-regular fa-eye${viewPass ? "" : "-slash"}`} />
                </button>
                <p className={validData ? styles.withoutError : ""}>{errorMsg}</p>
            </aside>
        );
    }
);

export const Divider = () => (
    <section className={styles.sectionOr}>
        <span className={styles.rowLine}></span>
        <span>O</span>
        <span className={styles.rowLine}></span>
    </section>
);

export const GoogleLoginButton = ({ loading }: { loading: boolean }) => (
    <section className={styles.loginGoogle}>
        <button disabled={loading}>
            <img src={logoGoogle} alt="Google" />
            <span>Continuar con Google</span>
        </button>
    </section>
);

export const ForgotPasswordSection = () => (
    <section className={styles.forgetPass}>
        <Link to={"/recuperar-contrasena"} className={styles.linkForget}>¿Olvidaste tu contraseña?</Link>
    </section>
);

export const SocialMediaIcons = () => (
    <section className={styles.socialMedia}>
        {["instagram", "whatsapp", "facebook", "twitter", "telegram"].map((platform) => (
            <i key={platform} className={`fa-brands fa-${platform}`} title={platform}>
                {" "}
            </i>
        ))}
    </section>
);

export const AccountSection = ({ loading }: { loading: boolean }) => (
    <aside className={styles.asideCreateAccount}>
        <h1>¿ No tienes una cuenta ?</h1>
        <p>
            Regístrate en nuestro sistema y accede a un mundo de cuidados especializados para tu mascota.
            <br />Con tu cuenta, podrás:
        </p>
        <ul>
            <li>Comprar productos veterinarios de alta calidad.</li>
            <li>Gestionar el historial clínico de tus mascotas: vacunas, tratamientos, diagnósticos y próximas citas.</li>
            <li>Agendar servicios veterinarios (consultas, peluquería, emergencias) desde la comodidad de tu hogar.</li>
            <li>Recibir alertas personalizadas para desparasitación, controles anuales y promociones exclusivas.</li>
        </ul>
        <aside>
            <Link to={loading ? "" : "/registro-usuario"}>
                <ButtonComponent contain="CREAR CUENTA" />
            </Link>
        </aside>
        <SocialMediaIcons />
    </ aside>
);
