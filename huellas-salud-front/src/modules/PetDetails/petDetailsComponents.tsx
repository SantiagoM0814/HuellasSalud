import styles from "./petDetails.module.css";
import { formatDate } from "../Users/UserManagement/usersUtils";
import { PetData, Pet, InputEditProps, MedicalHistory, FormHistoryProps, CreateHistoryModalProps, Vaccine, AuthContext, UserData } from "../../helper/typesHS";
import { memo, useContext, useEffect, useState } from "react";
import { useHistoryRegister } from "./petDetailsService";
import ButtonComponent from "../../components/Button/Button";
import { useUserService } from "../Users/UserManagement/usersService";

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
  const { user } = useContext(AuthContext);
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

          {petHistory?.length ? (
            <ul className={styles.ulTreatment}>
              {petHistory
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
      console.log(petHistory);
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

          {(user?.role === "VETERINARIO" || user?.role === "ADMINISTRADOR") && (
            <button className={styles.addHistory} onClick={() => setModal(true)}>Añadir historial</button>
          )}

          <h3 className={styles.subTitle}>🩺 Procedimientos</h3>

          {petHistory?.length ? (
            <div className={styles.timeline}>
              {petHistory
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

                      {history.surgeries?.length && (
                        <p><strong>Cirugías:</strong> {history.surgeries.join(", ")}</p>
                      )}

                      {history.vaccines?.length && (
                        <div className={styles.vaccineList}>
                          <strong>Vacunas aplicadas:</strong>
                          <ul>
                            {history.vaccines.map((v, i) => (
                              <li key={`${history.idHistory}-vaccine-${i}`}>
                                {v.name} — Aplicada: {new Date(v.dateApplied).toLocaleDateString()}
                                {v.singleDose
                                  ? <strong> — Única Dosis</strong>
                                  : v.validUntil && ` (Válida hasta: ${new Date(v.validUntil).toLocaleDateString()})`
                                }
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
  const { user } = useContext(AuthContext);
  const { handleCreateHistorySubmit, loading, register, errors, handleSubmit } = useHistoryRegister({ setModalHistory, setPetData })
  const { handleGetVeterinarians } = useUserService();

  const [surgeries, setSurgeries] = useState<string[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [users, setUsers] = useState<UserData[] | undefined>([]);

  useEffect(() => {
    const fetchVeterinarians = async () => {
      const data = await handleGetVeterinarians();
      setUsers(data);
    }

    if (user?.role === "ADMINISTRADOR") {
      fetchVeterinarians();
    }
  }, []);

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
    <form className={styles.formRegister} onSubmit={handleSubmit(handleCreateHistorySubmit)}>
      <h3 className={styles.inputFull}>Agregar Historial Médico</h3>

      {/* <InputField label="Diagnóstico" idInput="diagnostic" register={register} errors={errors}/>
      <InputField label="Tratamiento" idInput="treatment" register={register} errors={errors} required={false}/> */}
      <aside className={styles.inputField}>
        <label htmlFor="treatment">Tratamiento<span className={styles.required}>*</span></label>
        <textarea
          id="treatment"
          {...register("treatment", {
            required: "El tratamiento es obligatorio",
            minLength: {
              value: 10,
              message: "Minimo 10 caracteres"
            },
            maxLength: {
              value: 200,
              message: "Máximo 200 caracteres",
            },
          })}
        />
        {errors.treatment && (
          <p className={styles.errorMsg}>{errors.treatment.message}</p>
        )}
      </aside>
      <aside className={styles.inputField}>
        <label htmlFor="diagnostic">Diagnóstico<span className={styles.required}>*</span></label>
        <textarea
          id="diagnostic"
          {...register("diagnostic", {
            required: "El diagnostico es obligatorio",
            minLength: {
              value: 10,
              message: "Minimo 10 caracteres"
            },
            maxLength: {
              value: 200,
              message: "Máximo 200 caracteres",
            },
          })}
        />
        {errors.diagnostic && (
          <p className={styles.errorMsg}>{errors.diagnostic.message}</p>
        )}
      </aside>
      <section className={`${styles.inputField} ${styles.midInput}`}>
        {user?.role === "ADMINISTRADOR" ? (
          <>
            <label>Veterinario<span className={styles.required}>*</span></label>
            <select className={`${errors.veterinarian ? styles.errorInput : ''}`} {...register("veterinarian", { required: "Debe seleccionar un veterinario" })}>
              <option value="">Seleccione un veterinario</option>
              {users?.map(user => (
                <option key={user.data.documentNumber} value={`${user.data.name} ${user.data.lastName}`}>
                  {user.data.name} {user.data.lastName}
                </option>
              ))}
            </select>
            {errors.veterinarian && (
              <p className={styles.errorMsg}>{errors.veterinarian.message}</p>
            )}
          </>
        ) : (
          <>
            <input type="hidden" id="veterinarian" value={`${user?.name} ${user?.lastName}`} {...register("veterinarian")}></input>
          </>
        )}
      </section>

      <section className={styles.surgeriesVaccinesContainer}>
        <h4>Cirugías</h4>
        {surgeries.map((s, i) => (
          <input
            key={`surgery-${i}`}
            type="text"
            value={s}
            {...register(`surgeries.${i}`)}
            placeholder={`Cirugía ${i + 1}`}
            onChange={(e) => handleSurgeryChange(i, e.target.value)}
            className={styles.surgeryInput}
          />
        ))}
        <button type="button" onClick={addSurgery} className={styles.addButton}>
          <i className="fa-solid fa-square-plus"></i> Agregar cirugía
        </button>

        <h4>Vacunas</h4>
        {vaccines.map((v, i) => (
          <div key={`vaccine-${i}`} className={styles.vaccineGroup}>
            <input
              type="text"
              placeholder="Nombre de vacuna"
              value={v.name}
              {...register(`vaccines.${i}.name`)}
              onChange={(e) => handleVaccineChange(i, "name", e.target.value)}
            />
            <input
              type="date"
              value={v.dateApplied}
              {...register(`vaccines.${i}.dateApplied`)}
              onChange={(e) => handleVaccineChange(i, "dateApplied", e.target.value)}
            />
            <input
              type="date"
              value={v.validUntil}
              {...register(`vaccines.${i}.validUntil`)}
              onChange={(e) => handleVaccineChange(i, "validUntil", e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={v.singleDose}
                {...register(`vaccines.${i}.singleDose`)}
                onChange={(e) => handleVaccineChange(i, "singleDose", e.target.checked)}
              />
              Dosis única
            </label>
          </div>
        ))}
        <button type="button" onClick={addVaccine} className={styles.addButton}>
          <i className="fa-solid fa-square-plus"></i> Agregar vacuna
        </button>
      </section>


      {/* Botones */}
      <aside className={`${styles.containerButtons} ${styles.inputFull}`}>
        <ButtonComponent type="submit" contain="Agregar Historial" loading={loading} />
      </aside>
    </form>
  )
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
