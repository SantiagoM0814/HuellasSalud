import { useEffect } from "react";
import ButtonComponent from "../../components/Button/Button";
import styles from "./passwordRecovery.module.css";
import { usePassRecService } from "./passwordRecoveryService";
import Spinner from "../../components/spinner/Spinner";

const ResetPassword = () => {

    const {
        loading,
        validatingCode,
        setPassword,
        setConfirmPassword,
        handleSubmitReset,
        handleValidateToken,
        validData,
        errorMsg
    } = usePassRecService();

    useEffect(() => {
        const validateToken = async () => {
            await handleValidateToken();
        }
        validateToken();
    }, []);

    if (validatingCode) return (<Spinner />);

    return (
        <section className={styles.resetContainer}>
            <aside className={styles.modal}>
                <h1>Cambia tu contraseña</h1>
                <form className={`${styles.form} ${styles.restForm}`} onSubmit={handleSubmitReset}>
                    <label className="label" htmlFor="password">Nueva contraseña</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label className="label" htmlFor="confirmPassword">Confirmar contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <p className={styles.errorMsg}>{!validData && errorMsg}</p>
                    <ButtonComponent type="submit" contain="Cambiar mi contraseña" loading={loading} />
                </form>
            </aside>
        </section>
    );
}

export default ResetPassword;