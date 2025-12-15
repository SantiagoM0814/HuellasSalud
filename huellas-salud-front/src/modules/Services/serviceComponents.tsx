import { useEffect, useState } from "react";
import { CreateServiceModalProps, FormServiceProps, InputFieldServiceRegister, Meta, SearchBarProps, Service, ServiceData, ServiceFiltersProps, ServiceTableProps } from "../../helper/typesHS";
import styles from './servicesAdmin.module.css';
import { statusOptions, tableServiceColumns } from "../Users/UserManagement/usersUtils";
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

  const [weightPriceRules, setWeightPriceRules] = useState<
    { minWeight: number; maxWeight: number; price: number }[]
  >([]);

  const {
    handleCreateServiceSubmit, confirmUpdate, loading, register, errors,
    handleSubmit, fileName, fileInput, previewImg, handleChangeImg
  } = useServiceRegister({ setModalService, setServicesData, serviceSelected });

  useEffect(() => {
    if (serviceSelected && serviceSelected.data.priceByWeight && serviceSelected.data.weightPriceRules) {
      setWeightPriceRules(serviceSelected.data.weightPriceRules);
    } else {
      setWeightPriceRules([]);
    }
  }, [serviceSelected]);

  const onSubmit = (data: any) => {
    let payload: any = { ...data };

    // Filtramos reglas válidas (no vacías)
    const validRules = weightPriceRules.filter(
      (r) => r.minWeight > 0 && r.maxWeight > 0 && r.price > 0 && r.maxWeight > r.minWeight
    );

    // Solo agregamos si hay reglas válidas
    if (validRules.length > 0) {
      payload.priceByWeight = true;
      payload.weightPriceRules = validRules;
    } else {
      payload.priceByWeight = false;
    }

    if (serviceSelected) {
      confirmUpdate(payload);
    } else {
      handleCreateServiceSubmit(payload);
    }
  };



  return (
    <form
      className={styles.formRegisterService}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Imagen */}
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
          {!previewImg && <i className="fa-solid fa-stethoscope"></i>}
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
      <InputField label="Precio Base" idInput="basePrice" type="number" register={register} errors={errors} />
      <aside className={styles.inputField}>
        <label htmlFor="shortDescription">Descripción corta<span className={styles.required}>*</span></label>
        <textarea
          id="shortDescription"
          {...register("shortDescription", {
            required: "La descripción es obligatoria",
            minLength: { value: 20, message: "Mínimo 20 caracteres" },
            maxLength: { value: 250, message: "Máximo 250 caracteres" },
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
            minLength: { value: 100, message: "Mínimo 100 caracteres" },
            maxLength: { value: 500, message: "Máximo 500 caracteres" },
          })}
        />
        {errors.longDescription && (
          <p className={styles.errorMsg}>{errors.longDescription.message}</p>
        )}
      </aside>

      <section className={styles.weightRulesContainer}>
        <h4>Rangos de precio por peso</h4>

        {weightPriceRules.map((rule, index) => (
          <div key={index} className={styles.ruleGroup}>
            <aside className={styles.ruleField}>
              <label>Peso mínimo (kg)</label>
              <input
                type="number"
                placeholder="0"
                value={rule.minWeight === 0 ? "" : rule.minWeight}
                onChange={(e) => {
                  const updated = [...weightPriceRules];
                  updated[index].minWeight = e.target.value === "" ? 0 : Number(e.target.value);
                  setWeightPriceRules(updated);
                }}
                onBlur={() => {
                  const updated = [...weightPriceRules];
                  const current = updated[index];

                  if (index > 0 && current.minWeight <= updated[index - 1].maxWeight) {
                    alert("El peso mínimo debe ser mayor al máximo del rango anterior");
                    current.minWeight = updated[index - 1].maxWeight + 1;
                  }

                  setWeightPriceRules(updated);
                }}
              />
            </aside>

            {/* Peso máximo */}
            <aside className={styles.ruleField}>
              <label>Peso máximo (kg)</label>
              <input
                type="number"
                placeholder="0"
                value={rule.maxWeight === 0 ? "" : rule.maxWeight}
                onChange={(e) => {
                  const updated = [...weightPriceRules];
                  updated[index].maxWeight = e.target.value === "" ? 0 : Number(e.target.value);
                  setWeightPriceRules(updated);
                }}
                onBlur={() => {
                  const updated = [...weightPriceRules];
                  const current = updated[index];
                  if (current.maxWeight <= current.minWeight) {
                    alert("El peso máximo debe ser mayor al mínimo");
                    current.maxWeight = current.minWeight + 1;
                  }
                  setWeightPriceRules(updated);
                }}
              />
            </aside>

            {/* Precio */}
            <aside className={styles.ruleField}>
              <label>Precio (COP)</label>
              <input
                type="number"
                placeholder="0"
                value={rule.price === 0 ? "" : rule.price}
                onChange={(e) => {
                  const updated = [...weightPriceRules];
                  updated[index].price = e.target.value === "" ? 0 : Number(e.target.value);
                  setWeightPriceRules(updated);
                }}
                onBlur={() => {
                  const updated = [...weightPriceRules];
                  const current = updated[index];

                  // 👇 obtenemos el precio base del formulario
                  const basePriceInput = document.getElementById("basePrice") as HTMLInputElement | null;
                  const basePrice = basePriceInput ? Number(basePriceInput.value) : 0;

                  // 🔹 Validación: el primer rango no puede ser menor al precio base
                  if (index === 0 && current.price < basePrice) {
                    alert("El precio del primer rango no puede ser menor al precio base");
                    current.price = basePrice;
                  }

                  // 🔹 Validación: los precios siguientes deben ser mayores al rango anterior
                  if (index > 0 && current.price <= updated[index - 1].price) {
                    alert("El precio debe ser mayor al del rango anterior");
                    current.price = updated[index - 1].price + 1000;
                  }

                  setWeightPriceRules(updated);
                }}
              />
            </aside>

          </div>
        ))}

        <button
          type="button"
          className={styles.btnAddRule}
          onClick={() => {
            const last = weightPriceRules[weightPriceRules.length - 1];

            // Obtenemos el valor actual del input de precio base (seguro en TS)
            const basePriceInput = document.getElementById("basePrice") as HTMLInputElement | null;
            const basePriceValue = basePriceInput ? Number(basePriceInput.value) : 0;

            if (!last) {
              // Si no hay rangos, usar el precio base como valor inicial
              setWeightPriceRules([
                {
                  minWeight: 0,
                  maxWeight: 0,
                  price: basePriceValue > 0 ? basePriceValue : 0,
                },
              ]);
            } else {
              // Si ya existen rangos, seguir la lógica habitual
              setWeightPriceRules([
                ...weightPriceRules,
                {
                  minWeight: last.maxWeight + 1,
                  maxWeight: 0,
                  price: last.price + 1000,
                },
              ]);
            }
          }}
        >
          + Añadir rango
        </button>
        {weightPriceRules.length > 0 && (
  <button
    type="button"
    className={styles.btnAddRule}
    onClick={() => {
      setWeightPriceRules((prev) => {
        const updated = [...prev];
        updated.pop(); // elimina el último elemento
        return updated;
      });
    }}
  >
    🗑️ Eliminar último rango
  </button>
)}


      </section>

      {/* Botón final */}
      <aside className={`${styles.containerButtons} ${styles.inputFull}`}>
        <ButtonComponent
          type="submit"
          contain={serviceSelected ? "Actualizar Servicio" : "Crear Servicio"}
          loading={loading}
        />
      </aside>
    </form>
  );
};


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