import styles from "./userRegister.module.css";
import { FormUserRegister, InfoUserRegister } from "./userRegisterComponenets";

const UserRegister = () => {
    return(
        <main className={styles.containerRegister}>
            <FormUserRegister />
            <InfoUserRegister />
        </main>
    );
}

export default UserRegister;