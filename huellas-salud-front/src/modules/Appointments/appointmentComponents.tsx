import { useContext, useEffect, useState } from "react";
import { Appointment, AppointmentData, AppointmentFiltersProps, AppointmentTableProps, AuthContext, CreateAppointmentModalProps, CreateProductModalProps, CreateServiceModalProps, FormAppointmentProps, FormProductProps, FormServiceProps, InputFieldAppointmentRegister, InputFieldProductRegister, InputFieldServiceRegister, Meta, Pet, PetData, Product, ProductData, ProductTableProps, SearchBarProps, Service, ServiceData, ServiceFiltersProps, ServiceTableProps, UserData, WeightPriceRule } from "../../helper/typesHS";
import styles from './appointmentsAdmin.module.css';
import { formatDate, statusOptions, tableAppointmentColumns, tableProductColumns, tableServiceColumns, unitOfMeasure } from "../Users/UserManagement/usersUtils";
import { formatCurrencyCOP } from "../../helper/formatter";
import { useAppointmentRegister } from "./appointmentRegisterService";
import { appointmentValidationRules } from "./validationRulesAppointmentRegister";
import { RegisterOptions } from "react-hook-form";
import ButtonComponent from "../../components/Button/Button";
import { useAppointmentService } from "./appointmentsService";
import Spinner from "../../components/spinner/Spinner";
import { useUserService } from "../Users/UserManagement/usersService";
import { usePetService } from "../Pets/petService";
import { useServiceService } from "../Services/servicesService";
import { toast } from "react-toastify";

export const AppointmentsFilters = ({
  searchTerm,
  statusFilter,
  setModalCreateAppointment,
  onSearchChange,
  onStatusFilterChange
}: AppointmentFiltersProps) => (
  <section className={styles.filters}>
    <SearchBar
      placeholder="Buscar por nombre..."
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
    />

    <aside className={styles.selectFilters}>
      <button className={styles.btnCreateService} onClick={() => setModalCreateAppointment(true)}>Registrar cita</button>
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

export const AppointmentTable = ({ appointments, setAppointmentsData }: AppointmentTableProps) => {
  const { handleGetUsers } = useUserService();
  const { handleGetPets } = usePetService();
  const [appointmentSelected, setAppointmentSelected] = useState<AppointmentData | undefined>(undefined)
  const [isModalEditAppointment, setIsModalEditAppointment] = useState<boolean>(false);
  const { confirmDelete } = useAppointmentService();
  const [users, setUsers] = useState<UserData[] | undefined>([]);
  const [pets, setPets] = useState<PetData[] | undefined>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await handleGetUsers();
      const dataPet = await handleGetPets();
      setUsers(data);
      setPets(dataPet);
    };

    fetchUserData();
  }, [setAppointmentsData]);

  const handleEditAppointment = (appointment: Appointment, meta: Meta) => {
    setIsModalEditAppointment(prev => !prev);
    setAppointmentSelected({ data: appointment, meta })
  }

  const getShortName = (userId: string) => {
    const u = users?.find(u => u.data.documentNumber == userId);
    if (!u) return "Cargando...";
    const firstName = u.data.name.split(' ')[0];
    const lastName = u.data.lastName.split(' ')[0];
    return `${firstName} ${lastName}`;
  };


  if (!appointments || appointments.length === 0) return (<Spinner />);

  // const changeAppointmentStatus = async (appointment: Appointment, meta: Meta) => {
  //   if (await confirmUpdate(appointment)) meta.lastUpdate = new Date().toString();
  // }

  const deleteAppointment = async (appointment: Appointment) => {
    const idAppointment = await confirmDelete(appointment);
    if (idAppointment) setAppointmentsData(prev => prev?.filter(p => p.data.idAppointment !== idAppointment));
  };

  return (
    <section className={styles.tableContainer}>
      <table className={styles.serviceTable}>
        <thead>
          <tr>
            {tableAppointmentColumns.map(column => (<th key={column}>{column}</th>))}
          </tr>
        </thead>
        <tbody>
          {appointments?.map(({ data: appointment, meta }) => (
            <tr key={appointment.idAppointment}>
              <td>
                <aside className={styles.serviceInfo}>
                  <span className={styles.imgService}>
                    <AppointmentImg appointment={appointment} />
                  </span>
                  <div className={styles.serviceDetails}>
                    <span className={styles.serviceName}>
                      {getShortName(appointment.idOwner)}
                    </span>
                    <span className={styles.servicetDate}>
                      Registro: {new Date(meta.creationDate).toLocaleDateString()}
                    </span>
                  </div>
                </aside>
              </td>
              <td>{pets?.find(p => p.data.idPet == appointment.idPet)?.data.name || "Cargando..."}</td>
              <td>{formatDate(appointment.dateTime)}</td>
              <td>{getShortName(appointment.idVeterinarian)}</td>
              <td>
                <span className={`${styles.status} ${appointment.status ? styles.active : styles.inactive}`}>
                  {appointment.status ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <aside className={styles.actions}>
                  <button
                    title="Editar"
                    className={`${styles.btn} ${styles.edit}`}
                    onClick={() => handleEditAppointment(appointment, meta)}
                  >
                    <i className="fa-regular fa-pen-to-square" />
                  </button>
                  <button
                    title="Eliminar"
                    className={`${styles.btn} ${styles.delete}`}
                    onClick={() => deleteAppointment(appointment)}
                  >
                    <i className="fa-regular fa-trash-can" />
                  </button>
                  {/* <button
                    title="Cambiar Estado"
                    className={`${styles.btn} ${styles.toggleStatus}`}
                    onClick={() => changeAppointmentStatus(appointment, meta)}
                  >
                    <i className="fa-solid fa-power-off" />
                  </button> */}
                </aside>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalEditAppointment && (
        <main className={styles.overlay}>
          <section className={styles.modal}>
            <button className={styles.closeButton} onClick={() => setIsModalEditAppointment && setIsModalEditAppointment(false)}>x</button>
            <section className={styles.backgroundModalEdit} />
            <FormAppointment setModalAppointment={setIsModalEditAppointment} setAppointmentsData={setAppointmentsData} appointmentSelected={appointmentSelected} />
          </section>
        </main>
      )}
    </section>
  );
}

export const AppointmentImg = ({ appointment }: { appointment: Appointment }) => {

  const initials = appointment.idAppointment.charAt(0).toUpperCase();
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#A37AFC', '#FFA07A'];
  const color = colors[initials.charCodeAt(0) % colors.length];

  return (
    <div className={`${styles.imgDefault}`} style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}

export const FormAppointment = ({ setModalAppointment, setAppointmentsData, appointmentSelected, selectedServiceId }: FormAppointmentProps) => {
  const { user } = useContext(AuthContext);
  const { handleGetUsers } = useUserService();
  const { handleGetServices } = useServiceService();
  const { handleGetPetsOwner } = usePetService();
  const [petsByOwner, setPetsByOwner] = useState<PetData[] | undefined>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [users, setUsers] = useState<UserData[] | undefined>([]);
  const [services, setServices] = useState<ServiceData[] | undefined>([]);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [loadingHours, setLoadingHours] = useState(false);

  


  useEffect(() => {
    const loadInitialData = async () => {
      if (!services || services.length === 0) {
        const servicesData = await handleGetServices();
        setServices(servicesData);
      }

      if (!users || users.length === 0) {
        const usersData = await handleGetUsers();
        setUsers(usersData);
      }

      if (selectedServiceId) {
    reset({
      services: [selectedServiceId],
    });
    console.log("Servicio seleccionado:", selectedServiceId);
  }
    };

    loadInitialData();
  }, [selectedServiceId]);

  const [weightPriceRules, setWeightPriceRules] = useState<
    { minWeight: number; maxWeight: number; price: number }[]
  >([]);

  const handleOwnerChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ownerId = e.target.value;
    setValue("idOwner", ownerId);

    if (!ownerId) {
      setPetsByOwner([]);
      return;
    }

    try {
      setLoadingPets(true);
      const pets = await handleGetPetsOwner(ownerId);
      setPetsByOwner(pets);
    } catch (error) {
      console.error("Error al cargar mascotas:", error);
    } finally {
      setLoadingPets(false);
    }
  };

  const {
    errorMsg, handleCreateAppointmentSubmit, confirmUpdate, loading, register, errors,
    handleSubmit, setValue, watch, reset
  } = useAppointmentRegister({ setModalAppointment, setAppointmentsData, appointmentSelected });

  const selectedOwner = watch("idOwner");
  const selectedVet = watch("idVeterinarian");
  const selectedDate = watch("date");
  const selectedHour = watch("hour");
  const selectedService = watch("services");

  useEffect(() => {
    const fetchAvailableHours = async () => {
      if (!selectedDate || !selectedVet) return;

      setAvailableHours([]);
      setLoadingHours(true);

      try {
        const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

        const response = await fetch(
          `http://localhost:8080/internal/appointment/available?idVeterinarian=${selectedVet}&date=${formattedDate}`
        );

        if (!response.ok) {
          toast.warning(`El veterinario no tiene horario disponible para el día seleccionado. 🐾`, { autoClose: 3000 });
          setAvailableHours([]);
          return;
        }
        const data = await response.json();
        console.log("🕓 Horarios recibidos:", data);

        setAvailableHours(data.availableSlots || []);
      } catch (error) {
        console.error("❌ Error al obtener horarios:", error);
      } finally {
        setLoadingHours(false);
      }
    };

    fetchAvailableHours();
  }, [selectedDate, selectedVet]);

  useEffect(() => {
    const loadFormData = async () => {
      if (!appointmentSelected?.data) return;
      const appt = appointmentSelected.data;

      if (!users || users.length === 0) {
        const usersData = await handleGetUsers();
        setUsers(usersData);
      }

      if (!services || services.length === 0) {
        const servicesData = await handleGetServices();
        setServices(servicesData);
      }

      const pets = await handleGetPetsOwner(appt.idOwner);
      setPetsByOwner(pets);

      const dateObj = new Date(appt.dateTime);
      const date = dateObj.toISOString().split("T")[0];
      const hour = dateObj.toTimeString().split(" ")[0].slice(0, 5);

      reset({
        ...appt,
        date,
        hour,
        services: Array.isArray(appt.services) ? appt.services : [appt.services],
      });

      // 6️⃣ Guardar hora seleccionada temporalmente
      setSelectedHourFromAppointment(hour);
    };

    loadFormData();
  }, [appointmentSelected, reset]);

  const [selectedHourFromAppointment, setSelectedHourFromAppointment] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedHourFromAppointment) return;
    if (availableHours.length === 0) return;

    setAvailableHours(prev => {
      if (!prev.includes(selectedHourFromAppointment)) {
        return [selectedHourFromAppointment, ...prev];
      }
      return prev;
    });
  }, [availableHours, selectedHourFromAppointment]);

  return (
    <form
      className={styles.formRegisterService}
      onSubmit={handleSubmit(appointmentSelected ? confirmUpdate : handleCreateAppointmentSubmit)}
    >
      <section className={`${styles.inputField}`}>
        {(user?.role === "ADMINISTRADOR" || user?.role === "VETERINARIO") ? (
          <>
            <label>Cliente<span className={styles.required}>*</span></label>
            <select className={`${errors.idOwner ? styles.errorInput : ''}`} {...register("idOwner", { required: "Debe seleccionar un cliente" })}
              onChange={handleOwnerChange}
            >
              <option value="">Seleccione un cliente</option>
              {users?.map(user => (
                <option key={user.data.documentNumber} value={user.data.documentNumber}>
                  {user.data.name} {user.data.lastName}
                </option>
              ))}
            </select>
            {errors.idOwner && (
              <p className={styles.errorMsg}>{errors.idOwner.message}</p>
            )}
          </>
        ) : (
          <>
            <input type="hidden" id="idOwner" value={user?.documentNumber} {...register("idOwner")}></input>
          </>
        )}
      </section>
      <section className={styles.inputField}>
        <label>Mascota <span className={styles.required}>*</span></label>
        <select
          className={`${errors.idPet ? styles.errorInput : ''}`}
          {...register("idPet", { required: "Debe seleccionar una mascota" })}
          disabled={!selectedOwner || loadingPets}
        >
          {!selectedOwner ? (
            <option value="">Seleccione un cliente primero</option>
          ) : loadingPets ? (
            <option value="">Cargando mascotas...</option>
          ) : petsByOwner && petsByOwner.length > 0 ? (
            <>
              <option value="">Seleccione una mascota</option>
              {petsByOwner.map(pet => (
                <option key={pet.data.idPet} value={pet.data.idPet}>
                  {pet.data.name}
                </option>
              ))}
            </>
          ) : (
            <option value="">No hay mascotas registradas</option>
          )}
        </select>
        {errors.idPet && <p className={styles.errorMsg}>{errors.idPet.message}</p>}
      </section>
      <section className={`${styles.inputField}`}>
        <label>Servicio<span className={styles.required}>*</span></label>
        <select className={`${errors.services ? styles.errorInput : ''}`} {...register("services", { required: "Debe seleccionar un servicio" })}>
          <option value="">Seleccione un servicio</option>
          {services?.map(service => (
            <option key={service.data.idService} value={service.data.idService}>
              {service.data.name}
            </option>
          ))}
        </select>
        {errors.services && (
          <p className={styles.errorMsg}>{errors.services.message}</p>
        )}
      </section>
      <section className={`${styles.inputField}`}>
        <label>Veterinario<span className={styles.required}>*</span></label>
        <select className={`${errors.idVeterinarian ? styles.errorInput : ''}`} {...register("idVeterinarian", { required: "Debe seleccionar un veterinario" })}
        >
          <option value="">Seleccione un veterinario</option>
          {users?.map(user => (
            <option key={user.data.documentNumber} value={user.data.documentNumber}>
              {user.data.name} {user.data.lastName}
            </option>
          ))}
        </select>
        {errors.idVeterinarian && (
          <p className={styles.errorMsg}>{errors.services?.message}</p>
        )}
      </section>
      <InputField type="date" label="Fecha" idInput="date" register={register} errors={errors} />
      <section className={styles.inputField}>
        <label>Hora<span className={styles.required}>*</span></label>
        <select
          {...register("hour", { required: "Debe seleccionar una hora disponible" })}
          disabled={!selectedDate || loadingHours}
        >
          {!selectedDate ? (
            <option value="">Seleccione una fecha primero</option>
          ) : loadingHours ? (
            <option value="">Cargando horas...</option>
          ) : availableHours.length > 0 ? (
            <>
              <option value="">Seleccione una hora</option>
              {availableHours.map((hour, index) => (
                <option key={index} value={hour}>
                  {hour}
                </option>
              ))}
            </>
          ) : (
            <option value="">No hay horas disponibles</option>
          )}
        </select>
        {errors.hour && <p className={styles.errorMsg}>{errors.hour.message}</p>}
      </section>
      {(() => {
        const selectedServiceId = Array.isArray(watch("services"))
          ? watch("services")[0]
          : watch("services");
        const selectedPetId = watch("idPet");

        const selectedService = services?.find(s => s.data.idService === selectedServiceId);
        const selectedPet = petsByOwner?.find(p => p.data.idPet === selectedPetId);

        let priceToShow: number | string | null = null;

        if (selectedService && selectedPet) {
          if (selectedService.data.priceByWeight) {
            const rule = selectedService.data.weightPriceRules?.find(
              (r: WeightPriceRule) =>
                selectedPet.data.weight >= r.minWeight &&
                selectedPet.data.weight <= r.maxWeight
            );
            priceToShow = rule ? rule.price : "Consultar";
          } else {
            priceToShow = selectedService.data.basePrice;
          }
        }

        return (
          <section className={styles.inputField}>
            <label>Precio estimado</label>
            <p className={styles.priceDisplay}>
              {priceToShow
                ? typeof priceToShow === "number"
                  ? `$${priceToShow.toLocaleString("es-CO")}`
                  : priceToShow
                : "Seleccione servicio y mascota"}
            </p>
          </section>
        );
      })()}


      <aside className={`${styles.containerButtons} ${styles.inputFull}`}>
        <ButtonComponent
          type="submit"
          contain={appointmentSelected ? "Actualizar Servicio" : "Crear Servicio"}
          loading={loading}
        />
      </aside>
    </form>
  );
};


export const AppointmentModal = ({ setModalAppointment, setAppointmentsData, selectedServiceId }: CreateAppointmentModalProps) => {
  return (
    <main className={styles.overlay}>
      <section className={styles.modal}>
        <button className={styles.closeButton} onClick={() => setModalAppointment && setModalAppointment(false)}>x</button>
        <section className={styles.backgroundModalEdit} />
        <FormAppointment setModalAppointment={setModalAppointment} setAppointmentsData={setAppointmentsData} selectedServiceId={selectedServiceId}/>
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
}: InputFieldAppointmentRegister) => {

  const fieldValidation = appointmentValidationRules[idInput] as RegisterOptions<Appointment, typeof idInput>;

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