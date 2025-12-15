import { useState } from "react";
import { Announcement, AnnouncementData, AnnouncementFiltersProps, AnnouncementTableProps, CreateAnnouncementModalProps, FormAnnouncementProps, InputFieldAnnouncementRegister, Meta, SearchBarProps } from "../../helper/typesHS";
import styles from './announcement.module.css';
import { statusOptions, tableAnnouncementColumns } from "../Users/UserManagement/usersUtils";
import { announcementValidationRules } from "./validationRulesAnnouncementRegister";
import { RegisterOptions } from "react-hook-form";
import ButtonComponent from "../../components/Button/Button";
import { useAnnouncementsService } from "./announcementsService";
import { useAnnouncementRegister } from "./announcementRegisterService";

export const AnnouncementsFilters = ({
  searchTerm,
  statusFilter,
  setModalCreateAnnouncement,
  onSearchChange,
  onStatusFilterChange
}: AnnouncementFiltersProps) => (
  <section className={styles.filters}>
    <SearchBar
      placeholder="Buscar por nombre del publicador..."
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
    />

    <aside className={styles.selectFilters}>
      <button className={styles.btnCreateService} onClick={() => setModalCreateAnnouncement(true)}>Registrar anuncio</button>
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

export const AnnouncementTable = ({ announcements, setAnnouncementsData }: AnnouncementTableProps) => {
  const [announcementSelected, setAnnouncementSelected] = useState<AnnouncementData | undefined>(undefined)
  const [isModalEditAnnouncement, setIsModalEditAnnouncement] = useState<boolean>(false);
  const { confirmDelete, confirmUpdate } = useAnnouncementsService();

  const handleEditAnnouncement = (announcement: Announcement, meta: Meta) => {
    setIsModalEditAnnouncement(prev => !prev);
    setAnnouncementSelected({ data: announcement, meta })
  }

  if (!announcements || announcements.length === 0) return (<h2>No hay anuncios registrados</h2>);

  const changeAppointmentStatus = async (announcement: Announcement, meta: Meta) => {
    if (await confirmUpdate(announcement)) meta.lastUpdate = new Date().toString();
  }

  const deleteAnnouncement = async (announcement: Announcement) => {
    const idAnnouncement = await confirmDelete(announcement);
    if (idAnnouncement) setAnnouncementsData(prev => prev?.filter(p => p.data.idAnnouncement !== idAnnouncement));
  };

  return (
    <section className={styles.tableContainer}>
      <table className={styles.serviceTable}>
        <thead>
          <tr>
            {tableAnnouncementColumns.map(column => (<th key={column}>{column}</th>))}
          </tr>
        </thead>
        <tbody>
          {announcements?.map(({ data: announcement, meta }) => (
            <tr key={announcement.idAnnouncement}>
              <td>
                <aside className={styles.serviceInfo}>
                  <span className={styles.imgService}>
                    <AnnouncementImg announcement={announcement} />
                  </span>
                  <div className={styles.serviceDetails}>
                    <span className={styles.serviceName}>
                       {meta?.nameUserCreated ?? "Usuario desconocido"}
                    </span>
                    <span className={styles.servicetDate}>
                      Registro: {new Date(meta.creationDate).toLocaleDateString()}
                    </span>
                  </div>
                </aside>
              </td>
              <td>{announcement.description}</td>
              <td>
                <span className={`${styles.status} ${announcement.status ? styles.active : styles.inactive}`}>
                  {announcement.status ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <aside className={styles.actions}>
                  <button
                    title="Editar"
                    className={`${styles.btn} ${styles.edit}`}
                    onClick={() => handleEditAnnouncement(announcement, meta)}
                  >
                    <i className="fa-regular fa-pen-to-square" />
                  </button>
                  <button
                    title="Eliminar"
                    className={`${styles.btn} ${styles.delete}`}
                    onClick={() => deleteAnnouncement(announcement)}
                  >
                    <i className="fa-regular fa-trash-can" />
                  </button>
                  <button
                    title="Cambiar Estado"
                    className={`${styles.btn} ${styles.toggleStatus}`}
                    onClick={() => changeAppointmentStatus(announcement, meta)}
                  >
                    <i className="fa-solid fa-power-off" />
                  </button>
                </aside>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalEditAnnouncement && (
        <main className={styles.overlay}>
          <section className={styles.modal}>
            <button className={styles.closeButton} onClick={() => setIsModalEditAnnouncement && setIsModalEditAnnouncement(false)}>x</button>
            <section className={styles.backgroundModalEdit} />
            <FormAnnouncement setModalCreateAnnouncement={setIsModalEditAnnouncement} setAnnouncementsData={setAnnouncementsData} announcementSelected={announcementSelected} />
          </section>
        </main>
      )}
    </section>
  );
}

export const AnnouncementImg = ({ announcement }: { announcement: Announcement }) => {
  if (announcement.mediaFile) {
    return (<img src={`data:${announcement.mediaFile.contentType};base64,${announcement.mediaFile.attachment}`} alt={announcement.cellPhone} />);
  }

  const initials = announcement.description.charAt(0).toUpperCase();
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#A37AFC', '#FFA07A'];
  const color = colors[initials.charCodeAt(0) % colors.length];

  return (
    <div className={`${styles.imgDefault}`} style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}


export const FormAnnouncement = ({ setModalCreateAnnouncement, setAnnouncementsData, announcementSelected }: FormAnnouncementProps) => {

  const {
    handleCreateAnnouncementSubmit, confirmUpdate, loading, register, errors, previewImg,handleSubmit, fileInput, fileName, handleChangeImg
  } = useAnnouncementRegister({ setModalCreateAnnouncement, setAnnouncementsData, announcementSelected });

  return (
    <form
      className={styles.formRegisterService}
      onSubmit={handleSubmit(announcementSelected ? confirmUpdate : handleCreateAnnouncementSubmit)}
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
          {!previewImg && (<i className="fa-solid fa-box-open"></i>)}
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
      <InputField label="Teléfono" type="number" idInput="cellPhone" register={register} errors={errors}/>
      <aside className={styles.inputField}>
        <label htmlFor="description">Descripción<span className={styles.required}>*</span></label>
        <textarea
          id="description"
          {...register("description", {
            required: "La descripción es obligatoria",
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
        {errors.description && (
          <p className={styles.errorMsg}>{errors.description.message}</p>
        )}
      </aside>
      <aside className={`${styles.containerButtons} ${styles.inputFull}`}>
        <ButtonComponent
          type="submit"
          contain={announcementSelected ? "Actualizar Anuncio" : "Crear Anuncio"}
          loading={loading}
        />
      </aside>
    </form>
  );
};


export const AnnouncementModal = ({ setModalCreateAnnouncement, setAnnouncementsData }: CreateAnnouncementModalProps) => {
  return (
    <main className={styles.overlay}>
      <section className={styles.modal}>
        <button className={styles.closeButton} onClick={() => setModalCreateAnnouncement && setModalCreateAnnouncement(false)}>x</button>
        <section className={styles.backgroundModalEdit} />
        <FormAnnouncement setModalCreateAnnouncement={setModalCreateAnnouncement} setAnnouncementsData={setAnnouncementsData} />
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
}: InputFieldAnnouncementRegister) => {

  const fieldValidation = announcementValidationRules[idInput] as RegisterOptions<Announcement, typeof idInput>;

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