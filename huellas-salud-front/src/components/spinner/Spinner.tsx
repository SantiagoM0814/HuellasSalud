import styles from "./spinner.module.css";

const Spinner = () => (
    <section className={styles.spinnerContainer}>
        <span className={styles.loader}></span>
    </section>
);

export default Spinner;