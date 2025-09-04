import styles from './home.module.css';
import imgHistory from "../../assets/historial.webp";
import imgPagos  from "../../assets/pagos.webp";
import imgRotativo from "../../assets/rotativo.webp";
import imgPrincipal from "../../assets/Principal.webp";
import imgCacauate from "../../assets/Cacauate.webp";
import imgComida from "../../assets/Comida_Gato.webp";
import imgConsulta from "../../assets/ConsultaM.webp";
import imgSmartbones from "../../assets//Smartbones_Pollo.webp";
import imgTratamientos from "../../assets/Tratamientos.webp"
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const goToProductos = () => navigate('/productos');
    const goToServicios = () => navigate('/servicios');

    return (
        
    <main>
        <section className={styles.contenedorMain}>
        <div className={styles.contenedorImagen}>
          <img src={imgPrincipal} alt="Imagen principal" className={styles.imagenLateral} loading="lazy" />
        </div>

        <section>
          <header className={styles.header}>
            <h1>Huellas y Salud</h1>
            <p>
              ¿Te apasiona el mundo animal? Si eres amante de los perros, los gatos o la fauna salvaje, descubre
              <strong> Huellas y Salud</strong>, una web de animales donde podrás encontrar los mejores productos y
              servicios para brindarles un mejor cuidado a tus mascotas.
            </p>
          </header>

          <section className={styles.products}>
            <h2>ALGUNOS DE NUESTROS PRODUCTOS</h2>
            <br />
            <div className={styles.contenedorProductos}>
              <article>
                <img src={imgSmartbones} alt="Smartbones Pollo Mini X 8 Unidades" loading="lazy" />
                <h3>Smartbones Pollo Mini X 8 Unidades</h3>
                <p>Alimento</p>
              </article>
              <article>
                <img src={imgComida} alt="Wow Cat - Pavo Cocinado sin Refrigeración" loading="lazy" />
                <h3>Wow Cat - Pavo Cocinado sin Refrigeración</h3>
                <p>Alimento</p>
              </article>
              <article>
                <img src={imgCacauate} alt="Cacahuate para Loros y Palomas" loading="lazy" />
                <h3>Cacahuate para Loros y Palomas</h3>
                <p>Alimento</p>
              </article>
            </div>
            <article className={styles.verMas}>
              <button className={styles.btnVerMas} onClick={goToProductos}>Conocer más productos ...</button>
            </article>
          </section>

          <section className={styles.services}>
            <h2>ALGUNOS DE NUESTROS SERVICIOS</h2>
            <div className={styles.contenedorServicios}>
              <article>
                <img src={imgConsulta} alt="Consultas Medicas" loading="lazy" />
                <h3>Consulta Médica</h3>
              </article>
              <article>
                <img src={imgTratamientos} alt="Tratamientos" loading="lazy" />
                <h3>Tratamientos</h3>
              </article>
            </div>
            <article className={styles.verMas}>
              <button className={styles.btnVerMas2} onClick={goToServicios}>Conocer más servicios ...</button>
            </article>
          </section>
          <br />
        </section>
      </section>

      <section className={styles.elegirnos}>
        <div className={styles.textoElegirnos}>
          <h2>
            ¿<span className={styles.resaltado}>Por qué</span> elegirnos?
          </h2>
          <p>
            En nuestra veterinaria, ofrecemos atención profesional y amorosa para tu mascota. Contamos con un equipo
            experto y un ambiente acogedor para garantizar el bienestar de tu mejor amigo.
          </p>
        </div>

        <div className={styles.beneficios}>
          <div className={styles.itemBeneficio}>
            <img src={imgPagos} alt="Icono de economía" />
            <h3>Economía</h3>
            <p>Te ofrecemos excelentes precios en todos nuestros servicios</p>
          </div>
          <div className={styles.itemBeneficio}>
            <img src={imgHistory} alt="Icono de historial médico" />
            <h3>Historial</h3>
            <p>Te ofrecemos todo el historial médico de los procesos que se le realizan a tu amigo peludo</p>
          </div>
          <div className={styles.itemBeneficio}>
            <img src={imgRotativo} alt="Icono de citas" />
            <h3>Citas</h3>
            <p>Te ofrecemos un apartado para visualizar la disponibilidad de citas</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerRow}>
            <div className={styles.footerLinks}>
              <h4>Compañía</h4>
              <ul>
                <li><a href="#">Nosotros</a></li>
                <li><a href="#">Nuestros Servicios</a></li>
                <li><a href="#">Política de Privacidad</a></li>
                <li><a href="#">Únete</a></li>
              </ul>
            </div>
            <div className={styles.footerLinks}>
              <h4>Ayuda</h4>
              <ul>
                <li><a href="#">Preguntas frecuentes</a></li>
                <li><a href="#">Nuestros Productos</a></li>
                <li><a href="#">Métodos de pago</a></li>
                <li><a href="#">Pagos</a></li>
              </ul>
            </div>
            <div className={styles.footerLinks}>
              <h4>Tienda</h4>
              <ul>
                <li><a href="#">Comida para gatos</a></li>
                <li><a href="#">Comida para perros</a></li>
                <li><a href="#">Accesorios para gatos</a></li>
                <li><a href="#">Accesorios para perros</a></li>
              </ul>
            </div>
            <div className={styles.footerLinks}>
              <h4>Síguenos</h4>
              <div className={styles.socialLink}>
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
    );
}

export default Home;