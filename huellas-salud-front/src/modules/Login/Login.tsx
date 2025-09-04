import styles from "./login.module.css";
import logoLogin from "../../assets/Huellas&Salud_3.png";
import {
  AccountSection,
  Divider,
  ForgotPasswordSection,
  GoogleLoginButton,
  LoginForm,
} from "./loginComponents";
import { useState } from "react";

const Login = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <main className={styles.containerLogin}>
      <section className={styles.sectionRegister}>
        <AccountSection loading={loading} />
      </section>
      <section className={styles.sectionForm}>
        <aside className={styles.containerForm}>
          <picture>
            <img
              className={styles.logoLogin}
              src={logoLogin}
              alt="Huellas & Salud"
            />
          </picture>
          <p className={styles.titleLogin}>Inicio de Sesión</p>
          <LoginForm loading={loading} setLoading={setLoading} />
          <ForgotPasswordSection />
          <Divider />
          <GoogleLoginButton loading={loading} />
        </aside>
      </section>
    </main>
  );
};

export default Login;
