import styles from "./petDetails.module.css";
import { formatDate } from "../Users/UserManagement/usersUtils";
import { PetData, Pet, InputEditProps, MedicalHistory, FormHistoryProps, CreateHistoryModalProps, InputFieldHistoryRegister } from "../../helper/typesHS";
import { memo, useState } from "react";
import { useHistoryRegister } from "./petDetailsService";
import ButtonComponent from "../../components/Button/Button";
import { medicalHistoryValidationRules } from "./medicalHistoryValidationRules";
import { RegisterOptions } from "react-hook-form";

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

const InfoPet = ({ pet, option }: { pet: Pet; option: number }) => {
  const [modal, setModal] = useState(false);
  const [petHistory, setPetHistory] = useState<MedicalHistory[] | undefined>(pet.medicalHistory);

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

          <button className={styles.addHistory} onClick={() => setModal(true)}>Añadir historial</button>

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
          {modal && <ModalCreateHistory setModalHistory={setModal} setPetData={setPetHistory} />}
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

export const ModalCreateHistory = ({ setModalHistory, setPetData }: CreateHistoryModalProps) => {
  return (
    <main className={styles.overlay}>
      <section className={styles.modal}>
        <button className={styles.closeButton} onClick={() => setModalHistory && setModalHistory(false)}>x</button>
        <section className={styles.backgroundModalEdit} />
        <FormHistory setModalHistory={setModalHistory} setPetData={setPetData} />
      </section>
    </main>
  )
}

export const FormHistory = ({ setModalHistory, setPetData }: FormHistoryProps) => {
  const { errorMsg, handleCreateHistorySubmit, loading, register, errors, handleSubmit, reset } = useHistoryRegister({ setModalHistory, setPetData })

  const [surgeries, setSurgeries] = useState<string[]>([""]);
  const [vaccines, setVaccines] = useState([{ name: "", dateApplied: "", validUntil: "", singleDose: false }]);

  const addSurgery = () => setSurgeries((prev) => [...prev, ""]);
  const handleSurgeryChange = (i: number, value: string) => {
    const updated = [...surgeries];
    updated[i] = value;
    setSurgeries(updated);
  };

  const addVaccine = () =>
    setVaccines((prev) => [...prev, { name: "", dateApplied: "", validUntil: "", singleDose: false }]);
  const handleVaccineChange = (i: number, field: string, value: string | boolean) => {
    const updated = [...vaccines];
    (updated[i] as any)[field] = value;
    setVaccines(updated);
  };
  return (
    <form onSubmit={handleSubmit(handleCreateHistorySubmit)}>
      <h3>Agregar Historial Médico</h3>
      {/* Diagnóstico */}
      <InputField
        label="Diagnóstico"
        idInput="diagnostic"
        register={register}
        errors={errors}
      />

      {/* Tratamiento (opcional) */}
      <InputField
        label="Tratamiento"
        idInput="treatment"
        register={register}
        errors={errors}
        required={false}
      />

      {/* Veterinario */}
      <InputField
        label="Veterinario"
        idInput="veterinarian"
        register={register}
        errors={errors}
      />

      {/* Cirugías */}
      <h4>Cirugías (opcional)</h4>
      {surgeries.map((s, i) => (
        <input
          key={`surgery-${i}`}
          type="text"
          value={s}
          placeholder={`Cirugía ${i + 1}`}
          onChange={(e) => handleSurgeryChange(i, e.target.value)}
          className={styles.surgeryInput}
        />
      ))}
      <button type="button" onClick={addSurgery} className={styles.addButton}>
        ➕ Agregar otra cirugía
      </button>

      {/* Vacunas */}
      <h4>Vacunas aplicadas (opcional)</h4>
      {vaccines.map((v, i) => (
        <div key={`vaccine-${i}`} className={styles.vaccineGroup}>
          <input
            type="text"
            placeholder="Nombre de vacuna"
            value={v.name}
            onChange={(e) => handleVaccineChange(i, "name", e.target.value)}
          />
          <input
            type="date"
            value={v.dateApplied}
            onChange={(e) => handleVaccineChange(i, "dateApplied", e.target.value)}
          />
          <input
            type="date"
            value={v.validUntil}
            onChange={(e) => handleVaccineChange(i, "validUntil", e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={v.singleDose}
              onChange={(e) => handleVaccineChange(i, "singleDose", e.target.checked)}
            />
            Dosis única
          </label>
        </div>
      ))}
      <button type="button" onClick={addVaccine} className={styles.addButton}>
        ➕ Agregar otra vacuna
      </button>

      {/* Botones */}
      <aside className={`${styles.containerButtons} ${styles.inputFull}`}>
        <ButtonComponent type="submit" contain="Agregar Historial" loading={loading} />
      </aside>
    </form>
  )
}

const InputField = ({
  label,
  type = "text",
  idInput,
  required = true,
  inputFull = false,
  register,
  errors
}: InputFieldHistoryRegister) => {

  const fieldValidation = medicalHistoryValidationRules[idInput] as RegisterOptions<MedicalHistory, typeof idInput>;

  return (
    <section className={styles.inputField}>
      <label htmlFor={idInput}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        className={`${errors[idInput] ? styles.errorInput : ''}`}
        id={idInput}
        type={type}
        required={required}
        {...register(idInput, fieldValidation)}
      />
      <span className={styles.validationError}>
        {errors[idInput]?.message as string}
      </span>
    </section >
  );
};

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
