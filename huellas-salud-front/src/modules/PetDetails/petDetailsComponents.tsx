import styles from "./petDetails.module.css"
import { PetData, Pet, InputEditProps } from "../../helper/typesHS"
import imgPet from "../../assets/simba.webp";
import { memo, useState } from "react";
import { fieldsFormPet } from "../Pets/dataPet";

export const PetDetails = ({ pet }: { pet: PetData }) => {
  const petData = pet.data;
  const [option, setOption] = useState<number>(1);

  return (
    <section className={styles.historyContainer}>
      <aside className={styles.photoPet}>
        <h1>{petData.name}</h1>
        <img src={`data:${petData.mediaFile?.contentType};base64,${petData.mediaFile?.attachment}`}  alt={petData.name} width="200" />
      </aside>
      <aside className={styles.informationPet}>
        <section className={styles.options}>
          <ul className={styles.ulOptions}>
            <li className={option === 1 ? styles.selected : ""} onClick={() => setOption(1)}>Información</li>
            <li className={option === 2 ? styles.selected : ""} onClick={() => setOption(2)}>Tratamientos</li>
            <li className={option === 3 ? styles.selected : ""} onClick={() => setOption(3)}>Historial</li>
            <li className={option === 4 ? styles.selected : ""} onClick={() => setOption(4)}>Proceso</li>
          </ul>
          <InfoPet pet={petData} option={option} />
        </section>
      </aside>
    </section>
  );
}

interface CompFormProps {
  setShowAdd: (updater: (prevState: boolean) => boolean) => void;
}

const InfoPet = ({ pet, option }: { pet: Pet; option: number }) => {
  switch (option) {
    case 1:
      return (
        <section className={styles.information}>
          <InputPet label="Nombre" value={pet?.name}/>
          <InputPet label="Especie" value={pet?.species ? capitalizeWords(pet.species) : ""} />
          <InputPet label="Raza" value={pet?.breed} />
          <InputPet label="Edad" value={pet?.age?.toString() ?? ""} />
          <InputPet label="Peso" value={pet?.weight?.toString() ?? ""} />
          <InputPet label="Descripción" value={pet?.description} />
          <InputPet label="Estado" value={pet?.name} />
          <InputPet label="Vacunas aplicadas" value={pet?.vaccines?.length ? pet.vaccines.join(", ") : "Ninguna"} />
          <InputPet label="Cirugias realizadas" value={pet?.surgeries?.length ? pet.surgeries.join(", ") : "Ninguna"} />
          <InputPet label="Tratamientos realizados" value={pet?.treatments?.length ? pet.treatments .join(", ") : "Ninguno"} />
        </section>
      );
    case 2:
      return (
        <section className={styles.optionDetial}>
          <h2>Tratamientos realizados</h2>
          <ul className={styles.ulTreatment}>
            <li className={styles.liTreatment}>
              <strong>Vacuna Antirrábica</strong><br />
              Fecha: 10/01/2025<br />
              Veterinario: Dr. Ramírez<br />
              Observaciones: Sin reacciones adversas.
            </li>
            <li className={styles.liTreatment}>
              <strong>Desparasitación interna</strong><br />
              Fecha: 05/02/2025<br />
              Veterinario: Dra. Gómez<br />
              Observaciones: Repetir en 3 meses.
            </li>
            <li className={styles.liTreatment}>
              <strong>Tratamiento para otitis</strong><br />
              Fecha: 20/03/2025<br />
              Veterinario: Dr. Pérez<br />
              Observaciones: Aplicar gotas 2 veces al día por 7 días.
            </li>
            <li className={styles.liTreatment}>
              <strong>Tratamiento para otitis</strong><br />
              Fecha: 20/03/2025<br />
              Veterinario: Dr. Pérez<br />
              Observaciones: Aplicar gotas 2 veces al día por 7 días.
            </li>
            <li className={styles.liTreatment}>
              <strong>Tratamiento para otitis</strong><br />
              Fecha: 20/03/2025<br />
              Veterinario: Dr. Pérez<br />
              Observaciones: Aplicar gotas 2 veces al día por 7 días.
            </li>
            
          </ul>
        </section>
      );
    case 3:
      return (
        <section className={styles.medicalHistory}>
          <h2>Historial Clínico</h2>
          <h3>Resumen de la Mascota</h3>
          <div style={{ background: "#eaf4f7", padding: "15px", borderRadius: "10px" }}>
            <p><strong>Nombre:</strong> {pet.name}</p>
            <p><strong>Especie:</strong> {capitalizeWords(pet.species)}</p>
            <p><strong>Raza:</strong> {pet.breed}</p>
            <p><strong>Edad:</strong> {pet.age}</p>
            <p><strong>Peso:</strong> {pet.weight}</p>
          </div>

          <h3 style={{ marginTop: "20px" }}>🩺 Último Procedimiento Realizado</h3>
          <div style={{ background: "#fef6e4", padding: "15px", borderRadius: "10px" }}>
            <p><strong>Fecha:</strong> 20/03/2025</p>
            <p><strong>Motivo:</strong> Infección en el oído</p>
            <p><strong>Tratamiento:</strong> Aplicación de gotas antibióticas durante 7 días</p>
            <p><strong>Veterinario:</strong> Dr. Pérez</p>
          </div>

          <h3 style={{ marginTop: "20px" }}>🔍 Revisión General</h3>
          <div style={{ background: "#e3f9e5", padding: "15px", borderRadius: "10px" }}>
            <p><strong>Estado general:</strong> Saludable</p>
            <p><strong>Observaciones:</strong> Buen estado de ánimo, apetito normal, sin signos visibles de dolor o infección.</p>
          </div>
          <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "10px" }}>
            <div >
              <strong>Fecha:</strong> 10/01/2025<br />
              <strong>Motivo de consulta:</strong> Vacunación<br />
              <strong>Diagnóstico:</strong> Salud óptima<br />
              <strong>Tratamiento:</strong> Aplicación de vacuna antirrábica<br />
              <strong>Veterinario:</strong> Dr. Ramírez
            </div>
            <div style={{ marginTop: "20px" }}>
              <strong>Fecha:</strong> 05/02/2025<br />
              <strong>Motivo de consulta:</strong> Desparasitación<br />
              <strong>Diagnóstico:</strong> Prevención<br />
              <strong>Tratamiento:</strong> Antiparasitario oral<br />
              <strong>Veterinario:</strong> Dra. Gómez
            </div>
            <div style={{ marginTop: "20px" }}>
              <strong>Fecha:</strong> 20/03/2025<br />
              <strong>Motivo de consulta:</strong> Infección en oído<br />
              <strong>Diagnóstico:</strong> Otitis externa<br />
              <strong>Tratamiento:</strong> Gotas óticas antibióticas<br />
              <strong>Veterinario:</strong> Dr. Pérez
            </div>
          </div>
        </section>
      );
    case 4:
      return (
        <div className={styles.containerProcess}>
          <div className={styles.steps}>
            <div className={`${styles.step} ${styles.completed}`}>
              <span className={styles.icon}>✔️</span>
              <p>Bañado</p>
            </div>
            <div className={`${styles.line} ${styles.completed}`}></div>
            <div className={`${styles.step} ${styles.completed}`}>
              <span className={styles.icon}>✔️</span>
              <p>Uñas</p>
            </div>
            <div className={`${styles.line} ${styles.incomplete}`}></div>
            <div className={`${styles.step} ${styles.incomplete}`}>
              <span className={styles.icon}>❌</span>
              <p>Desparasitación</p>
            </div>
            <div className={`${styles.line} ${styles.incomplete}`}></div>
            <div className={`${styles.step} ${styles.incomplete}`}>
              <span className={styles.icon}>❌</span>
              <p>Peluqueado</p>
            </div>
          </div>
          <p className={styles.message}>
            Tu mascota <strong>{pet.name}</strong> aún está en proceso de atención.<br />
            Te avisaremos cuando esté lista para ser recogida.<br /><br />
            ¡Gracias por tu paciencia! 🐾
          </p>
        </div>
      );
  }
}

const InputPet = memo(
  ({ label, value, isEditable = true }: InputEditProps) => (
        <aside className={styles.fieldGroup}>
            <label>{label}</label>
            <input value={value} disabled={isEditable} />
        </aside>
    )
)

const capitalizeWords = (text: string) =>
  text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
