import styles from "./Button.module.css";

interface PropsButton {
    loading?: boolean;
    contain: string;
    type?: "submit" | "button" | "reset" | undefined;
    handleClic?: () => void;
}

const ButtonComponent = ({ loading, contain, type = "button", handleClic }: PropsButton) => {
    return (
        <button className={styles.button} type={type} disabled={loading} onClick={handleClic} >
            {loading ? "CARGANDO..." : contain}
        </button>
    )
}

export default ButtonComponent;