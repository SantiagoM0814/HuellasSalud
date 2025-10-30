import { useContext, useEffect, useState } from "react";
import { Appointment, AuthContext, FormInvoiceProps, InputFieldAppointmentRegister, Invoice, InvoiceData, InvoiceFiltersProps, InvoiceTableProps, Meta, SearchBarProps } from "../../helper/typesHS";
import styles from './invoice.module.css';
import { formatDate, statusInvoices, tableAppointmentColumns, tableInvoiceColumns, tableProductColumns, tableServiceColumns, unitOfMeasure } from "../Users/UserManagement/usersUtils";
import { formatCurrencyCOP } from "../../helper/formatter";
import { useInvoiceRegister } from "./invoiceRegisterService";
import { appointmentValidationRules } from "./validationRulesAppointmentRegister";
import { RegisterOptions } from "react-hook-form";
import ButtonComponent from "../../components/Button/Button";
import { useInvoiceService } from "./invoiceService";
import Spinner from "../../components/spinner/Spinner";
import { useUserService } from "../Users/UserManagement/usersService";
import { usePetService } from "../Pets/petService";
import { useServiceService } from "../Services/servicesService";
import { toast } from "react-toastify";

export const InvoicesFilters = ({
  searchTerm,
  statusFilter,
  setModalCreateInvoice,
  onSearchChange,
  onStatusFilterChange
}: InvoiceFiltersProps) => (
  <section className={styles.filters}>
    <SearchBar
      placeholder="Buscar por producto o servicio..."
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
    />

    <aside className={styles.selectFilters}>
      <button className={styles.btnCreateService} onClick={() => setModalCreateInvoice(true)}>Registrar factura</button>
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className={styles.filterSelect}
      >
        {statusInvoices.map(option => (
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

export const InvoiceTable = ({ invoices, setInvoicesData, users, services, pets, prods }: InvoiceTableProps) => {

  const [invoiceSelected, setInvoiceSelected] = useState<InvoiceData | undefined>(undefined)
  const [isModalEditInvoice, setIsModalEditInvoice] = useState<boolean>(false);
  const { confirmDelete } = useInvoiceService();

  const handleEditInvoice = (invoice: Invoice, meta: Meta) => {
    setIsModalEditInvoice(prev => !prev);
    setInvoiceSelected({ data: invoice, meta })
  }

  const getShortName = (userId: string) => {
    const u = users?.find(u => u.data.documentNumber == userId);
    if (!u) return "Cargando...";
    const firstName = u.data.name.split(' ')[0];
    const lastName = u.data.lastName.split(' ')[0];
    return `${firstName} ${lastName}`;
  };

  // const changeAppointmentStatus = async (appointment: Appointment, meta: Meta) => {
  //   if (await confirmUpdate(appointment)) meta.lastUpdate = new Date().toString();
  // }

  const deleteInvoice = async (invoice: Invoice) => {
    const idInvoice = await confirmDelete(invoice);
    if (idInvoice) setInvoicesData(prev => prev?.filter(p => p.data.idInvoice !== idInvoice));
  };

  return (
    <section className={styles.tableContainer}>
      <table className={styles.serviceTable}>
        <thead>
          <tr>
            {tableInvoiceColumns.map(column => (<th key={column}>{column}</th>))}
          </tr>
        </thead>
        <tbody>
          {invoices?.map(({ data: invoice, meta }) => (
            <tr key={invoice.idInvoice}>
              <td>
                <aside className={styles.serviceInfo}>
                  <span className={styles.imgService}>
                    <InvoiceImg invoice={invoice} shortName={getShortName(invoice.idClient)} />
                  </span>
                  <div className={styles.serviceDetails}>
                    <span className={styles.serviceName}>
                      {getShortName(invoice.idClient)}
                    </span>
                  </div>
                </aside>
              </td>
              <td>{invoice.itemInvoice.map(i => i.name).join(", ")}</td>
              <td>{formatDate(invoice.date)}</td>
              <td>{formatCurrencyCOP(invoice.total)}</td>
              <td>
                <span
                  className={`${styles.status} ${invoice.status === "PAGADA"
                      ? styles.paid
                      : invoice.status === "PENDIENTE"
                        ? styles.pending
                        : styles.cancelled
                    }`}
                >
                  {invoice.status === "PAGADA"
                    ? "Pagada"
                    : invoice.status === "PENDIENTE"
                      ? "Pendiente"
                      : "Cancelada"}
                </span>
              </td>
              <td>
                <aside className={styles.actions}>
                  <button
                    title="Editar"
                    className={`${styles.btn} ${styles.edit}`}
                    onClick={() => handleEditInvoice(invoice, meta)}
                  >
                    <i className="fa-regular fa-pen-to-square" />
                  </button>
                  <button
                    title="Eliminar"
                    className={`${styles.btn} ${styles.delete}`}
                    onClick={() => deleteInvoice(invoice)}
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
      {/* {isModalEditInvoice && (
        <main className={styles.overlay}>
          <section className={styles.modal}>
            <button className={styles.closeButton} onClick={() => setIsModalEditInvoice && setIsModalEditInvoice(false)}>x</button>
            <section className={styles.backgroundModalEdit} />
            <FormInvoice setModalInvoice={setIsModalEditInvoice} setInvoicesData={setInvoicesData} invoiceSelected={invoiceSelected} users={users} services={services} pets={pets} prods={prods} />
          </section>
        </main>
      )} */}
    </section>
  );
}

interface InvoiceImgProps {
  invoice: Invoice;
  shortName?: string;
}

export const InvoiceImg = ({ invoice, shortName }: InvoiceImgProps) => {

  const initials = (shortName || "U").charAt(0).toUpperCase();
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#A37AFC', '#FFA07A'];
  const color = colors[initials.charCodeAt(0) % colors.length];

  return (
    <div className={`${styles.imgDefault}`} style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}

// export const FormInvoice = ({ setModalInvoice, setInvoicesData, invoiceSelected, users, services, pets, prods }: FormInvoiceProps) => {
//   const { user } = useContext(AuthContext);
//   const { handleGetPetsOwner } = usePetService();
//   const { handleGetAppointmentAvailable } = useAppointmentService();
//   const [petsByOwner, setPetsByOwner] = useState<PetData[] | undefined>([]);
//   const [loadingPets, setLoadingPets] = useState(false);
//   const [availableHours, setAvailableHours] = useState<string[]>([]);
//   const [loadingHours, setLoadingHours] = useState(false);

//   const {
//     errorMsg, handleCreateInvoiceSubmit, confirmUpdate, loading, register, errors,
//     handleSubmit, setValue, watch, reset
//   } = useInvoiceRegister({ setModalInvoice, setInvoicesData, invoiceSelected });

//   return (
//     <form
//       className={styles.formRegisterService}
//       onSubmit={handleSubmit(invoiceSelected ? confirmUpdate : handleCreateInvoiceSubmit)}
//     >
//       <section className={`${styles.inputField}`}>
//         {(user?.role === "ADMINISTRADOR" || user?.role === "VETERINARIO") ? (
//           <>
//             <label>Cliente<span className={styles.required}>*</span></label>
//             <select className={`${errors.idOwner ? styles.errorInput : ''}`} {...register("idOwner", { required: "Debe seleccionar un cliente" })}
//               onChange={handleOwnerChange}
//             >
//               <option value="">Seleccione un cliente</option>
//               {users?.map(user => (
//                 <option key={user.data.documentNumber} value={user.data.documentNumber}>
//                   {user.data.name} {user.data.lastName}
//                 </option>
//               ))}
//             </select>
//             {errors.idOwner && (
//               <p className={styles.errorMsg}>{errors.idOwner.message}</p>
//             )}
//           </>
//         ) : (
//           <>
//             <input type="hidden" id="idOwner" value={user?.documentNumber} {...register("idOwner")}></input>
//           </>
//         )}
//       </section>
//       <section className={styles.inputField}>
//         <label>Mascota <span className={styles.required}>*</span></label>
//         <select
//           className={`${errors.idPet ? styles.errorInput : ''}`}
//           {...register("idPet", { required: "Debe seleccionar una mascota" })}
//           disabled={!selectedOwner || loadingPets}
//         >
//           {!selectedOwner ? (
//             <option value="">Seleccione un cliente primero</option>
//           ) : loadingPets ? (
//             <option value="">Cargando mascotas...</option>
//           ) : petsByOwner && petsByOwner.length > 0 ? (
//             <>
//               <option value="">Seleccione una mascota</option>
//               {petsByOwner.map(pet => (
//                 <option key={pet.data.idPet} value={pet.data.idPet}>
//                   {pet.data.name}
//                 </option>
//               ))}
//             </>
//           ) : (
//             <option value="">No hay mascotas registradas</option>
//           )}
//         </select>
//         {errors.idPet && <p className={styles.errorMsg}>{errors.idPet.message}</p>}
//       </section>
//       <section className={`${styles.inputField}`}>
//         <label>Servicio<span className={styles.required}>*</span></label>
//         <select className={`${errors.services ? styles.errorInput : ''}`} {...register("services", { required: "Debe seleccionar un servicio" })}>
//           <option value="">Seleccione un servicio</option>
//           {services?.map(service => (
//             <option key={service.data.idService} value={service.data.idService}>
//               {service.data.name}
//             </option>
//           ))}
//         </select>
//         {errors.services && (
//           <p className={styles.errorMsg}>{errors.services.message}</p>
//         )}
//       </section>
//       <section className={`${styles.inputField}`}>
//         <label>Veterinario<span className={styles.required}>*</span></label>
//         <select className={`${errors.idVeterinarian ? styles.errorInput : ''}`} {...register("idVeterinarian", { required: "Debe seleccionar un veterinario" })}
//         >
//           <option value="">Seleccione un veterinario</option>
//           {vets?.map(vet => (
//             <option key={vet.data.documentNumber} value={vet.data.documentNumber}>
//               {vet.data.name} {vet.data.lastName}
//             </option>
//           ))}
//         </select>
//         {errors.idVeterinarian && (
//           <p className={styles.errorMsg}>{errors.services?.message}</p>
//         )}
//       </section>
//       <InputField type="date" label="Fecha" idInput="date" register={register} errors={errors} />
//       <section className={styles.inputField}>
//         <label>Hora<span className={styles.required}>*</span></label>
//         <select
//           {...register("hour", { required: "Debe seleccionar una hora disponible" })}
//           disabled={!selectedDate || loadingHours}
//         >
//           {!selectedDate ? (
//             <option value="">Seleccione una fecha primero</option>
//           ) : loadingHours ? (
//             <option value="">Cargando horas...</option>
//           ) : availableHours.length > 0 ? (
//             <>
//               <option value="">Seleccione una hora</option>
//               {availableHours.map((hour, index) => (
//                 <option key={index} value={hour}>
//                   {hour}
//                 </option>
//               ))}
//             </>
//           ) : (
//             <option value="">No hay horas disponibles</option>
//           )}
//         </select>
//         {errors.hour && <p className={styles.errorMsg}>{errors.hour.message}</p>}
//       </section>
//       {(() => {
//         const selectedServiceId = Array.isArray(watch("services"))
//           ? watch("services")[0]
//           : watch("services");
//         const selectedPetId = watch("idPet");

//         const selectedService = services?.find(s => s.data.idService === selectedServiceId);
//         const selectedPet = petsByOwner?.find(p => p.data.idPet === selectedPetId);

//         let priceToShow: number | string | null = null;

//         if (selectedService && selectedPet) {
//           if (selectedService.data.priceByWeight) {
//             const rule = selectedService.data.weightPriceRules?.find(
//               (r: WeightPriceRule) =>
//                 selectedPet.data.weight >= r.minWeight &&
//                 selectedPet.data.weight <= r.maxWeight
//             );
//             priceToShow = rule ? rule.price : "Consultar";
//           } else {
//             priceToShow = selectedService.data.basePrice;
//           }
//         }

//         return (
//           <section className={styles.inputField}>
//             <label>Precio estimado</label>
//             <p className={styles.priceDisplay}>
//               {priceToShow
//                 ? typeof priceToShow === "number"
//                   ? `$${priceToShow.toLocaleString("es-CO")}`
//                   : priceToShow
//                 : "Seleccione servicio y mascota"}
//             </p>
//           </section>
//         );
//       })()}


//       <aside className={`${styles.containerButtons} ${styles.inputFull}`}>
//         <ButtonComponent
//           type="submit"
//           contain={appointmentSelected ? "Actualizar Servicio" : "Crear Servicio"}
//           loading={loading}
//         />
//       </aside>
//     </form>
//   );
// };


// export const AppointmentModal = ({ setModalAppointment, setAppointmentsData, selectedServiceId, users, services, pets, vets }: CreateAppointmentModalProps) => {
//   const { user } = useContext(AuthContext);
//   const { handleGetPets } = usePetService();
//   const { handleGetUsers, handleGetVeterinarians } = useUserService();
//   const [localUsers, setLocalUsers] = useState(users);
//   const [localPets, setLocalPets] = useState(pets);
//   const [localVets, setLocalVets] = useState(vets);
//   const [loading, setLoading] = useState(false);

//   if (!user) {
//     toast.info("Debes iniciar sesión para agendar una cita", {autoClose: 3000})
//     return null;
//   }

//   useEffect(() => {
//     const fetchAppointmentData = async () => {
//       const needUsers = !localUsers || localUsers.length === 0;
//       const needPets = !localPets || localPets.length === 0;
//       const needVets = !localVets || localVets.length === 0;

//       if (needUsers || needPets || needVets) {
//         setLoading(true);
//         try {
//           const dataUser = await handleGetUsers();
//           const dataVet = await handleGetVeterinarians();

//           setLocalUsers(dataUser);
//           setLocalVets(dataVet);
//         } catch (error) {
//           console.error("❌ Error al cargar datos:", error);
//         } finally {
//           setLoading(false);
//         }
//       }

//     };

//     fetchAppointmentData();
//   }, []);

//   if (loading) return <Spinner />;

//   return (
//     <main className={styles.overlay}>
//       <section className={styles.modal}>
//         <button className={styles.closeButton} onClick={() => setModalAppointment && setModalAppointment(false)}>x</button>
//         <section className={styles.backgroundModalEdit} />
//         <FormAppointment setModalAppointment={setModalAppointment} setAppointmentsData={setAppointmentsData} selectedServiceId={selectedServiceId} users={localUsers} services={services} pets={localPets} vets={localVets} />
//       </section>
//     </main>
//   )
// }

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