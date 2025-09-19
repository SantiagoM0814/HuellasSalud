import styles from "./petDetails.module.css";
import { formatDate } from "../Users/UserManagement/usersUtils";
import { PetData, Pet, InputEditProps, MedicalHistory } from "../../helper/typesHS";
import { memo, useState } from "react";

export const PetDetails = ({ pet }: { pet: PetData }) => {
  const petData = pet.data;
  const [option, setOption] = useState<number>(1);

  return (
    <section className={styles.historyContainer}>
      <aside className={styles.photoPet}>
        <h1>{petData.name}</h1>
        <img src={`data:${petData.mediaFile?.contentType};base64,${petData.mediaFile?.attachment}`} alt={petData.name} width="200" />
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
          <InputPet label="Nombre" value={pet?.name} />
          <InputPet label="Especie" value={pet?.species ? capitalizeWords(pet.species) : ""} />
          <InputPet label="Raza" value={pet?.breed} />
          <InputPet label="Edad" value={pet?.age?.toString() ?? ""} />
          <InputPet label="Peso" value={pet?.weight?.toString() ?? ""} />
          <InputPet label="Descripción" value={pet?.description} />
          <InputPet label="Estado" value={pet?.name} />
        </section>
      );
    case 2:
  return (
    <section className={styles.optionDetial}>
      <h2 className={styles.sectionTitle}>💊 Tratamientos Realizados</h2>

      {pet.medicalHistory?.length ? (
        <ul className={styles.ulTreatment}>
          {pet.medicalHistory
            .filter(h => h.treatment) // Solo mostramos los que tienen tratamiento
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((history, index) => (
              <li key={history.idHistory || index} className={styles.liTreatment}>
                <strong>{history.diagnostic || "Tratamiento"}</strong><br />
                <span className={styles.date}>
                  Fecha: {new Date(history.date).toLocaleDateString("es-ES")}
                </span><br />
                <span className={styles.vet}>
                  Veterinario: {history.veterinarian}
                </span><br />
                <span className={styles.obs}>
                  {history.treatment}
                </span>
              </li>
            ))}
        </ul>
      ) : (
        <p className={styles.noHistory}>
          No hay tratamientos registrados para esta mascota.
        </p>
      )}
    </section>
  );

    case 3:
  return (
    <section className={styles.medicalHistory}>
      <h2 className={styles.sectionTitle}>📜 Historial Clínico</h2>

      <div className={styles.summaryCard}>
        <h3>Resumen</h3>
        <ul>
          <li><strong>Nombre:</strong> {pet.name}</li>
          <li><strong>Especie:</strong> {capitalizeWords(pet.species)}</li>
          <li><strong>Raza:</strong> {pet.breed}</li>
          <li><strong>Edad:</strong> {pet.age} años</li>
          <li><strong>Peso:</strong> {pet.weight} kg</li>
        </ul>
      </div>
      
      <h3 className={styles.subTitle}>🩺 Procedimientos</h3>

      {pet.medicalHistory?.length ? (
        <div className={styles.timeline}>
          {pet.medicalHistory
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((history: MedicalHistory, index: number) => (
              <div key={history.idHistory || `history-${index}`} className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <span className={styles.date}>{formatDate(history.date)}</span>

                  <p><strong>Diagnóstico:</strong> {history.diagnostic}</p>

                  {history.treatment && (
                    <p><strong>Tratamiento:</strong> {history.treatment}</p>
                  )}

                  <p><strong>Veterinario:</strong> {history.veterinarian}</p>

                  {/* Cirugías */}
                  {!!history.surgeries?.length && (
                    <p><strong>Cirugías:</strong> {history.surgeries.join(", ")}</p>
                  )}

                  {/* Vacunas */}
                  {!!history.vaccines?.length && (
                    <div className={styles.vaccineList}>
                      <strong>Vacunas aplicadas:</strong>
                      <ul>
                        {history.vaccines.map((v, i) => (
                          <li key={`${history.idHistory}-vaccine-${i}`}>
                            {v.name} — Aplicada: {formatDate(v.dateApplied)}
                            {v.validUntil && ` (Válida hasta: ${formatDate(v.validUntil)})`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className={styles.noHistory}>
          No hay historial médico registrado para esta mascota.
        </p>
      )}
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
