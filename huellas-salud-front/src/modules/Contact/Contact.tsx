import styles from './contact.module.css';
import img from '../../assets/fotoContacto.webp'

const Contact = () => {
    return (
        <main>
            <section id="contacto">
            <div className={styles.contacto}>
                <div className={styles.fondoContacto}>
                    <img src={img} alt="" />
                </div>
                <div className={styles.datos}>
                    <div className={styles.contactanos}>
                        <h1 className={styles.tituloContacto}>Contáctanos</h1>
                        <h4>Horario de disponibilidad</h4>
                        <p>Lunes a sábado<br />9:00 A.M. a 6:30 P.M.</p>
                        <h4>Nuestra información</h4>
                        <p>huellasysalud09@gmail.com</p>
                        <p>+57 3125378524</p>
                        <p>+57 3148657201</p>
                        <h4>Visítanos</h4>
                        <div className={styles.redes}>
                            <span><i className="fa-brands fa-twitter"></i></span>
                            <span><i className="fa-brands fa-whatsapp"></i></span>
                            <span><i className="fa-brands fa-facebook"></i></span>
                        </div>
                    </div>
                    <div className={styles.formContacto}>
                        <p>
                            Si tienes preguntas, inconsistencias, reclamos o<br />
                            necesitas información general, completa el<br />
                            siguiente formulario para solicitar la información<br />
                            que necesitas. Será un gusto atenderte.
                        </p>
                        <h4>Información para contactarte</h4>
                        <aside className={styles.form}>
                            <label htmlFor="nombre">Tu nombre</label>
                            <input type="text" id="nombre" placeholder="Ingresa tu nombre" />

                            <label htmlFor="correo">Tu correo</label>
                            <input type="email" id="correo" placeholder="Ingresa tu correo" />

                            <label htmlFor="mensaje">Tu mensaje</label>
                            <textarea id="mensaje" rows={6} placeholder="Mensaje..."></textarea>

                            <button type="submit">
                                Enviar mensaje
                            </button>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
        </main>
    );
}

export default Contact;