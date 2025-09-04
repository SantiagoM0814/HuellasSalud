import styles from './services.module.css';
import imgConsulta from '../../assets/ConsultaMedica.webp';
import imgTratamientos from '../../assets/TratamientosEspecializados.webp';
import imgSalud from '../../assets/SaludPreventiva.webp';
import imgPeluqueria from '../../assets/PeluqueriaBienestar.webp';

const Services = () => {
    return (
        <section id="servicios">
            <h1 className={styles.titulo}>Nuestros Servicios 🐾</h1>
            <div className={styles.serviciosContenedor}>

                <div className={`${styles.servicio} ${styles.abrirModal}`}>
                    <img src={imgConsulta} className={styles.consulta} alt="Consulta médica" />
                    <br />
                    <h1>Consulta <br /> Médica</h1>
                </div>

                <div className={styles.servicio}>

                        <img src={imgTratamientos} className={styles.consulta} alt="Tratamientos Especializados" />
                    <br />
                    <h1>Tratamientos Especializados</h1>
                </div>

                <div className={styles.servicio}>
                        <img src={imgSalud} className={styles.consulta} alt="Salud Preventiva" />
                    <br />
                    <h1>Salud <br /> Preventiva</h1>
                </div>

                <div className={styles.servicio}>
                    <img src={imgPeluqueria} className={styles.consulta} alt="Peluquería y Bienestar Animal" />
                    
                    <br />
                    <h1>Peluquería y Bienestar Animal</h1>
                </div>

            </div>
        </section>
    );
}

export default Services;