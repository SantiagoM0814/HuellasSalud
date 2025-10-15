import { useContext, useEffect, useState } from "react";
import { AuthContext, CreateProductModalProps, CreateServiceModalProps, FormProductProps, FormServiceProps, InputFieldProductRegister, InputFieldServiceRegister, Meta, Product, ProductData, ProductTableProps, SearchBarProps, Service, ServiceData, ServiceFiltersProps, ServiceTableProps } from "../../helper/typesHS";
import styles from './servicesAdmin.module.css';
import { categorys, species, statusOptions, tableProductColumns, tableServiceColumns, unitOfMeasure } from "../Users/UserManagement/usersUtils";
import { formatCurrencyCOP } from "../../helper/formatter";
import { useServiceRegister } from "./serviceRegisterService";
import { serviceValidationRules } from "./validationRulesServiceRegister";
import { RegisterOptions } from "react-hook-form";
import ButtonComponent from "../../components/Button/Button";
import { useServiceService } from "./servicesService";

export const ServiceFilters = ({
  searchTerm,
  statusFilter,
  setModalCreateService,
  onSearchChange,
  onStatusFilterChange
}: ServiceFiltersProps) => (
  <section className={styles.filters}>
    <SearchBar
      placeholder="Buscar por nombre..."
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
    />

    <aside className={styles.selectFilters}>
      <button className={styles.btnCreateService} onClick={() => setModalCreateService(true)}>Registrar Servicio</button>
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

export const ServiceTable = ({ services, setServicesData }: ServiceTableProps) => {
  const [serviceSelected, setServiceSelected] = useState<ServiceData | undefined>(undefined)
  const [isModalEditService, setIsModalEditService] = useState<boolean>(false);
  const { confirmUpdate, confirmDelete } = useServiceService();


  const handleEditService = (service: Service, meta: Meta) => {
    setIsModalEditService(prev => !prev);
    setServiceSelected({ data: service, meta })
  }

  if (!services || services.length === 0) return (<h2>No hay servicios registrados</h2>);

  const changeServiceStatus = async (service: Service, meta: Meta) => {
    if (await confirmUpdate(service)) meta.lastUpdate = new Date().toString();
  }

  const deleteService = async (service: Service) => {
      const idService = await confirmDelete(service);
      if (idService) setServicesData(prev => prev?.filter(p => p.data.idService !== idService));
    };

  return (
    <section className={styles.tableContainer}>
      <table className={styles.serviceTable}>
        <thead>
          <tr>
            {tableServiceColumns.map(column => (<th key={column}>{column}</th>))}
          </tr>
        </thead>
        <tbody>
          {services?.map(({ data: service, meta }) => (
            <tr key={service.idService}>
              <td>
                <aside className={styles.serviceInfo}>
                  <span className={styles.imgService}>
                    <ServiceImg service={service} />
                  </span>
                  <div className={styles.serviceDetails}>
                    <span className={styles.serviceName}>
                      {service.name}
                    </span>
                    <span className={styles.servicetDate}>
                      Registro: {new Date(meta.creationDate).toLocaleDateString()}
                    </span>
                  </div>
                </aside>
              </td>
              <td>{service.shortDescription}</td>
              <td>{formatCurrencyCOP(service.basePrice)}</td>
              <td>
                <span className={`${styles.status} ${service.state ? styles.active : styles.inactive}`}>
                  {service.state ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <aside className={styles.actions}>
                  <button
                    title="Editar"
                    className={`${styles.btn} ${styles.edit}`}
                    onClick={() => handleEditService(service, meta)}
                  >
                    <i className="fa-regular fa-pen-to-square" />
                  </button>
                  <button
                    title="Eliminar"
                    className={`${styles.btn} ${styles.delete}`}
                    onClick={() => deleteService(service)}
                  >
                    <i className="fa-regular fa-trash-can" />
                  </button>
                  <button
                    title="Cambiar Estado"
                    className={`${styles.btn} ${styles.toggleStatus}`}
                    onClick={() => changeServiceStatus(service, meta)}
                  >
                    <i className="fa-solid fa-power-off" />
                  </button>
                </aside>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalEditService && (
        <main className={styles.overlay}>
          <section className={styles.modal}>
            <button className={styles.closeButton} onClick={() => setIsModalEditService && setIsModalEditService(false)}>x</button>
            <section className={styles.backgroundModalEdit} />
            <FormService setModalService={setIsModalEditService} setServicesData={setServicesData} serviceSelected={serviceSelected} />
          </section>
        </main>
      )}
    </section>
  );
}

export const ServiceImg = ({ service }: { service: Service }) => {
  if (service.mediaFile) {
    return (<img src={`data:${service.mediaFile.contentType};base64,${service.mediaFile.attachment}`} alt={service.name} />);
  }

  const initials = service.name.charAt(0).toUpperCase();
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#A37AFC', '#FFA07A'];
  const color = colors[initials.charCodeAt(0) % colors.length];

  return (
    <div className={`${styles.imgDefault}`} style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}

export const FormService = ({ setModalService, setServicesData, serviceSelected }: FormServiceProps) => {
  const { user } = useContext(AuthContext);

  const {
    errorMsg, handleCreateServiceSubmit, confirmUpdate, loading, register, errors,
    handleSubmit, fileName, fileInput, previewImg, handleChangeImg, reset
  } = useServiceRegister({ setModalService, setServicesData, serviceSelected });

  return (
    <form
      className={styles.formRegisterService}
      onSubmit={handleSubmit(serviceSelected ? confirmUpdate : handleCreateServiceSubmit)}
    >
      <section className={styles.selectImg}>
        <label
          htmlFor="loadImg"
          className={styles.initialsAvatar}
          style={
            previewImg
              ? { backgroundImage: `url(${previewImg})`, backgroundSize: "cover", backgroundPosition: "center" }
              : {}
          }
        >
          {!previewImg && (<i className="fa-solid fa-stethoscope"></i>)}
        </label>
        <input
          type="file"
          name="image"
          id="loadImg"
          ref={fileInput}
          onChange={handleChangeImg}
          style={{ display: "none" }}
        />
        <span>{fileName}</span>
      </section>
      <InputField label="Nombre del servicio" idInput="name" register={register} errors={errors} />
      <aside className={styles.inputField}>
        <label htmlFor="shortDescription">Descripción corta<span className={styles.required}>*</span></label>
        <textarea
          id="shortDescription"
          {...register("shortDescription", {
            required: "La descripción es obligatoria",
            minLength: {
              value: 20,
              message: "Minimo 20 caracteres"
            },
            maxLength: {
              value: 250,
              message: "Máximo 250 caracteres",
            },
          })}
        />
        {errors.shortDescription && (
          <p className={styles.errorMsg}>{errors.shortDescription.message}</p>
        )}
      </aside>
      <aside className={styles.inputField}>
        <label htmlFor="longDescription">Descripción larga<span className={styles.required}>*</span></label>
        <textarea
          id="longDescription"
          {...register("longDescription", {
            required: "La descripción es obligatoria",
            minLength: {
              value: 100,
              message: "Minimo 100 caracteres"
            },
            maxLength: {
              value: 500,
              message: "Máximo 500 caracteres",
            },
          })}
        />
        {errors.longDescription && (
          <p className={styles.errorMsg}>{errors.longDescription.message}</p>
        )}
      </aside>
      <InputField label="Precio Base" idInput="basePrice" type="number" register={register} errors={errors} />
      <aside className={`${styles.containerButtons} ${styles.inputFull}`}>
        <ButtonComponent type="submit" contain={serviceSelected ? "Actualizar Servicio" : "Crear Servicio"} loading={loading} />
      </aside>
    </form>
  )
}

export const ServiceModal = ({ setModalService, setServicesData }: CreateServiceModalProps) => {
  return (
    <main className={styles.overlay}>
      <section className={styles.modal}>
        <button className={styles.closeButton} onClick={() => setModalService && setModalService(false)}>x</button>
        <section className={styles.backgroundModalEdit} />
        <FormService setModalService={setModalService} setServicesData={setServicesData} />
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
}: InputFieldServiceRegister) => {

  const fieldValidation = serviceValidationRules[idInput] as RegisterOptions<Service, typeof idInput>;

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