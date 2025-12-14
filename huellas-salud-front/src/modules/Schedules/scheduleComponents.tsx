import { useContext, useEffect, useState } from "react";
import { Appointment, AppointmentData, AppointmentTableProps, AuthContext, CreateAppointmentModalProps, CreateScheduleModalProps, FormAppointmentProps, FormScheduleProps, InputFieldAppointmentRegister, InputFieldScheduleRegister, Meta, PetData, Schedule, ScheduleData, ScheduleFiltersProps, ScheduleTableProps, SearchBarProps, WeightPriceRule } from "../../helper/typesHS";
import styles from './schedule.module.css';
import { daySchedule, daySchedules, formatDate, schedules, statusOptions, tableAppointmentColumns, tableScheduleColumns } from "../Users/UserManagement/usersUtils";
import { useScheduleRegister } from "./scheduleRegisterService";
import { scheduleValidationRules } from "./validationRulesScheduleRegister";
import { RegisterOptions } from "react-hook-form";
import ButtonComponent from "../../components/Button/Button";
import Spinner from "../../components/spinner/Spinner";
import { useUserService } from "../Users/UserManagement/usersService";
import { usePetService } from "../Pets/petService";
import { toast } from "react-toastify";
import { metaEmpty } from "../Pets/petsUtils";
import { useScheduleService } from "./schedulesService";

export const SchedulesFilters = ({
  searchTerm,
  statusFilter,
  dayFilter,
  setModalCreateSchedule,
  onSearchChange,
  onStatusFilterChange,
  onDayFilterChange
}: ScheduleFiltersProps) => (
  <section className={styles.filters}>
    <SearchBar
      placeholder="Buscar por id Veterinario..."
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
    />

    <aside className={styles.selectFilters}>
      <button className={styles.btnCreateService} onClick={() => setModalCreateSchedule(true)}>Registrar horario</button>
      <select
        value={dayFilter}
        onChange={(e) => onDayFilterChange(e.target.value)}
        className={styles.filterSelect}
      >
        {daySchedules.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className={styles.filterSelect}
      >
        {statusOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </aside>
  </section>
);

export const SearchBar = ({ placeholder, searchTerm, onSearchChange }: SearchBarProps) => (
  <aside className={styles.searchBar}>
    <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
    <input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  </aside>
);

export const ScheduleTable = ({ schedules, setSchedulesData, vets }: ScheduleTableProps) => {
  const { user } = useContext(AuthContext);
  const { handleGetUsers } = useUserService();
  const { handleGetPets } = usePetService();
  const [scheduleSelected, setScheduleSelected] = useState<ScheduleData | undefined>(undefined)
  const [isModalEditSchedule, setIsModalEditSchedule] = useState<boolean>(false);
  const { confirmDelete, confirmUpdate } = useScheduleService();

  const handleEditSchedule = (schedule: Schedule, meta: Meta) => {
    setIsModalEditSchedule(prev => !prev);
    setScheduleSelected({ data: schedule, meta })
  }

  const getShortName = (userId: string) => {
    const u = vets?.find(u => u.data.documentNumber == userId);
    if (!u) return "Cargando...";
    const firstName = u.data.name.split(' ')[0];
    const lastName = u.data.lastName.split(' ')[0];
    return `${firstName} ${lastName}`;
  };

  if (!schedules || schedules.length === 0) return (<h2>No hay horarios registrados</h2>);

  const changeScheduleStatus = async (schedule: Schedule, meta: Meta) => {
      if (await confirmUpdate(schedule)) meta.lastUpdate = new Date().toString();
  };

  const deleteSchedule = async (schedule: Schedule) => {
    const idSchedule = await confirmDelete(schedule);
    if (idSchedule) setSchedulesData(prev => prev?.filter(p => p.data.idSchedule !== idSchedule));
  };

  return (
    <section className={styles.tableContainer}>
      <table className={styles.serviceTable}>
        <thead>
          <tr>
            {tableScheduleColumns.map(column => (<th key={column}>{column}</th>))}
          </tr>
        </thead>
        <tbody>
          {schedules?.map(({ data: schedule, meta }) => (
            <tr key={schedule.idSchedule}>
              <td>
                <aside className={styles.serviceInfo}>
                  <span className={styles.imgService}>
                    <ScheduleImg schedule={schedule} shortName={getShortName(schedule.idVeterinarian)} />
                  </span>
                  <div className={styles.serviceDetails}>
                    <span className={styles.serviceName}>
                      {getShortName(schedule.idVeterinarian)}
                    </span>
                    <span className={styles.servicetDate}>
                      Registro: {new Date(meta.creationDate).toLocaleDateString()}
                    </span>
                  </div>
                </aside>
              </td>
              <td>{daySchedules.find(d => d.value === schedule.dayOfWeek)?.label}</td>
              <td>{schedule.startTime}</td>
              <td>{schedule.endTime}</td>
              <td>{schedule.lunchStart}</td>
              <td>{schedule.lunchEnd}</td>
              <td>
                <span className={`${styles.status} ${schedule.active ? styles.active : styles.inactive}`}>
                  {schedule.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <aside className={styles.actions}>
                  <button
                    title="Editar"
                    className={`${styles.btn} ${styles.edit}`}
                    onClick={() => handleEditSchedule(schedule, meta)}
                  >
                    <i className="fa-regular fa-pen-to-square" />
                  </button>
                  <button
                    title="Eliminar"
                    className={`${styles.btn} ${styles.delete}`}
                    onClick={() => deleteSchedule(schedule)}
                  >
                    <i className="fa-regular fa-trash-can" />
                  </button>
                  <button
                    title="Cambiar Estado"
                    className={`${styles.btn} ${styles.toggleStatus}`}
                    onClick={() => changeScheduleStatus(schedule, meta)}
                  >
                    <i className="fa-solid fa-power-off" />
                  </button>
                </aside>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalEditSchedule && (
        <main className={styles.overlay}>
          <section className={styles.modal}>
            <button className={styles.closeButton} onClick={() => setIsModalEditSchedule && setIsModalEditSchedule(false)}>x</button>
            <section className={styles.backgroundModalEdit} />
            <FormSchedule setModalSchedule={setIsModalEditSchedule} setSchedulesData={setSchedulesData} scheduleSelected={scheduleSelected} vets={vets} />
          </section>
        </main>
      )}
    </section>
  );
}

interface ScheduleImgProps {
  schedule: Schedule;
  shortName: string;
}


export const ScheduleImg = ({ shortName }: ScheduleImgProps) => {

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    const first = parts[0]?.charAt(0)?.toUpperCase() || "";
    const second = parts[1]?.charAt(0)?.toUpperCase() || "";
    return `${first}${second}` || first; // si solo hay un nombre
  };

  const initials = getInitials(shortName);
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#A37AFC', '#FFA07A'];
  const color = colors[initials.charCodeAt(0) % colors.length];

  return (
    <div className={styles.imgDefault} style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}

export const FormSchedule = ({ setModalSchedule, setSchedulesData, scheduleSelected, vets }: FormScheduleProps) => {
  const { user } = useContext(AuthContext);
  const { handleGetPetsOwner } = usePetService();
  const { handleGetSchedules } = useScheduleService();
  const [petsByOwner, setPetsByOwner] = useState<PetData[] | undefined>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [loadingHours, setLoadingHours] = useState(false);

  const {
    errorMsg, handleCreateScheduleSubmit, confirmUpdate, loading, register, errors,
    handleSubmit, setValue, watch, reset
  } = useScheduleRegister({ setModalSchedule, setSchedulesData, scheduleSelected });

  return (
    <form
      className={styles.formRegisterService}
      onSubmit={handleSubmit(scheduleSelected ? confirmUpdate : handleCreateScheduleSubmit)}
    >
      <aside className={styles.inputField}>
        <label>Día de trabajo<span className={styles.required}>*</span></label>
        <select id="dayOfWeek" className={`${errors.dayOfWeek ? styles.errorInput : ''}`} {...register("dayOfWeek", { required: "El día es obligatorio" })}>
          <option value="">Seleccione una día</option>
          {daySchedule.map(day =>
            (<option key={day.value} value={day.value}>{day.label}</option>)
          )}
        </select>
        {errors.dayOfWeek && (
          <p className={styles.errorMsg}>{errors.dayOfWeek.message}</p>
        )}
      </aside>

      <aside className={styles.inputField}>
        <label>Veterinario<span className={styles.required}>*</span></label>
        <select id="idVeterinarian" className={`${errors.idVeterinarian ? styles.errorInput : ''}`} {...register("idVeterinarian", { required: "El veterinario es obligatorio" })}>
          <option value="">Seleccione un veterinario</option>
          {vets?.map(vet =>
            (<option key={vet.data.documentNumber} value={vet.data.documentNumber}>{vet.data.name} {vet.data.lastName}</option>)
          )}
        </select>
        {errors.idVeterinarian && (
          <p className={styles.errorMsg}>{errors.idVeterinarian.message}</p>
        )}
      </aside>

      <aside className={styles.inputField}>
        <label>Hora Entrada<span className={styles.required}>*</span></label>
        <select id="startTime" className={`${errors.startTime ? styles.errorInput : ''}`} {...register("startTime", { required: "La hora de entrada es obligatoria" })}>
          <option value="">Seleccione una hora</option>
          {schedules?.map(schedule =>
            (<option key={schedule.value} value={schedule.value}>{schedule.label}</option>)
          )}
        </select>
        {errors.startTime && (
          <p className={styles.errorMsg}>{errors.startTime.message}</p>
        )}
      </aside>

      <aside className={styles.inputField}>
        <label>Hora Salida<span className={styles.required}>*</span></label>
        <select id="endTime" className={`${errors.endTime ? styles.errorInput : ''}`} {...register("endTime", { required: "La hora de salida es obligatoria" })}>
          <option value="">Seleccione una hora</option>
          {schedules?.map(schedule =>
            (<option key={schedule.value} value={schedule.value}>{schedule.label}</option>)
          )}
        </select>
        {errors.endTime && (
          <p className={styles.errorMsg}>{errors.endTime.message}</p>
        )}
      </aside>

      <aside className={styles.inputField}>
        <label>Hora Inicio Almuerzo<span className={styles.required}>*</span></label>
        <select id="lunchStart" className={`${errors.lunchStart ? styles.errorInput : ''}`} {...register("lunchStart", { required: "La hora de inicio almuerzo es obligatoria" })}>
          <option value="">Seleccione una hora</option>
          {schedules?.map(schedule =>
            (<option key={schedule.value} value={schedule.value}>{schedule.label}</option>)
          )}
        </select>
        {errors.lunchStart && (
          <p className={styles.errorMsg}>{errors.lunchStart.message}</p>
        )}
      </aside>

      <aside className={styles.inputField}>
        <label>Hora Fin Almuerzo<span className={styles.required}>*</span></label>
        <select id="lunchEnd" className={`${errors.lunchEnd ? styles.errorInput : ''}`} {...register("lunchEnd", { required: "La hora de fin almuerzo es obligatoria" })}>
          <option value="">Seleccione una hora</option>
          {schedules?.map(schedule =>
            (<option key={schedule.value} value={schedule.value}>{schedule.label}</option>)
          )}
        </select>
        {errors.lunchEnd && (
          <p className={styles.errorMsg}>{errors.lunchEnd.message}</p>
        )}
      </aside>

      <aside className={`${styles.containerButtons} ${styles.inputFull}`}>
        <ButtonComponent
          type="submit"
          contain={scheduleSelected ? "Actualizar Horario" : "Crear Horario"}
          loading={loading}
        />
      </aside>
    </form>
  );
};

export const ScheduleModal = ({ setModalSchedule, setSchedulesData, scheduleSelected, vets }: CreateScheduleModalProps) => {
  const { user } = useContext(AuthContext);
  const [localVets, setLocalVets] = useState(vets);

  return (
    <main className={styles.overlay}>
      <section className={styles.modal}>
        <button className={styles.closeButton} onClick={() => setModalSchedule && setModalSchedule(false)}>x</button>
        <section className={styles.backgroundModalEdit} />
        <FormSchedule setModalSchedule={setModalSchedule} setSchedulesData={setSchedulesData} scheduleSelected={scheduleSelected} vets={localVets} />
      </section>
    </main>
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
}: InputFieldScheduleRegister) => {

  const fieldValidation = scheduleValidationRules[idInput] as RegisterOptions<Schedule, typeof idInput>;

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