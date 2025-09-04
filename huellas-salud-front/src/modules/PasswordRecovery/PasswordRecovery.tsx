import ButtonComponent from "../../components/Button/Button";
import styles from "./passwordRecovery.module.css";
import { usePassRecService } from "./passwordRecoveryService";

const PasswordRecovery = () => {

    const { errorMsg, loading, inputEmail, validData, handleInputChange, handleSubmit } = usePassRecService();

    return (
        <main className={styles.recoveryContainer}>
            <section className={styles.container}>
                <div className={styles.modal}>
                    <h1>Recuperar contraseña</h1>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <p>Por favor introduce tu dirección de correo electrónico para recibir un enlace de restablecimiento de contraseña.</p>
                        <label className="label" htmlFor="email">Ingresa tu correo electrónico</label>
                        <input
                            type="email"
                            className="input"
                            name="email" id="email"
                            onChange={handleInputChange}
                            value={inputEmail}
                            required
                        />
                        <p className={styles.errorMsg}>{!validData && errorMsg}</p>
                        <ButtonComponent type="submit" contain="Reestablecer mi contraseña" loading={loading} />
                    </form>
                </div>
            </section>
        </main>
    );
}

export default PasswordRecovery;