import { useContext, useEffect, useMemo, useState } from "react";
import { sexOptionsFilter, species, statusOptions } from "../Users/UserManagement/usersUtils";
import { SearchBar } from "../Users/UserManagement/userComponents";
import { usePetService } from "./petService";
import { Meta, Pet, PetCardProps, PetData, FormPetProps, CreatePetModalProps, InputFieldPetRegister, UserData, AuthContext } from "../../helper/typesHS";
import defaultPetImage from "../../assets/default_pet.webp";
import styles from "./pets.module.css";
import { useNavigate } from "react-router-dom";
import { usePetRegister } from "./petRegisterService";
import ButtonComponent from "../../components/Button/Button";
import { RegisterOptions } from "react-hook-form";
import { validationRules } from "./validationRulesPetRegister";
import { useUserService } from "../Users/UserManagement/usersService";
import Spinner from "../../components/spinner/Spinner";

// export const FormPetRegister = () => (
//   <section className={styles.containerFormPet}>
//     <FormPet />
//   </section>
// )

export const CreatePetModal = ({ setModalCreatePet, setPetsData }: CreatePetModalProps) => {
  return (
    <main className={styles.overlay}>
      <section className={styles.modal}>
        <button className={styles.closeButton} onClick={() => setModalCreatePet && setModalCreatePet(false)}>x</button>
        <section className={styles.backgroundModalEdit} />
        <FormPet setModalCreatePet={setModalCreatePet} setPetsData={setPetsData} />
      </section>
    </main>
  )
}

export const FormPet = ({ setModalCreatePet, setPetsData, petSelected }: FormPetProps) => {
  const { user } = useContext(AuthContext);
  const { handleGetUsers } = useUserService();
  const [users, setUsers] = useState<UserData[] | undefined>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await handleGetUsers();
      setUsers(data);
    };

    if (user?.role === "ADMINISTRADOR" || user?.role === "VETERINARIO") {
      fetchUserData();
    }
  }, []);

  const {
    errorMsg, handleCreatePetSubmit, confirmUpdate, loading, register, errors,
    handleSubmit, fileName, fileInput, previewImg, handleChangeImg, reset
  } = usePetRegister({ setModalCreatePet, setPetsData, petSelected });

  useEffect(() => {
    if (petSelected?.data && users?.length) {
      reset({
        ...petSelected.data,
        idOwner: petSelected.data.idOwner
      });
    }
  }, [petSelected, users, reset]);


  const handelClicCancel = () => setModalCreatePet && setModalCreatePet(false);

  return (
    <form
      className={styles.formRegisterPet}
      onSubmit={handleSubmit(petSelected ? confirmUpdate : handleCreatePetSubmit)}
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
    {!previewImg && (<i className="fa-solid fa-dog"></i>)}
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
      <section className={`${styles.inputField}`}>
        {(user?.role === "ADMINISTRADOR" || user?.role === "VETERINARIO") ? (
          <>
            <label>Propietario<span className={styles.required}>*</span></label>
            <select className={`${errors.idOwner ? styles.errorInput : ''}`} {...register("idOwner", { required: "Debe seleccionar un propietario" })}>
              <option value="">Seleccione un usuario</option>
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
      <InputField label="Nombre de la mascota" idInput="name" register={register} errors={errors} />
      <InputField label="Raza de la mascota" idInput="breed" register={register} errors={errors} />
      <aside className={styles.inputField}>
        <label>Especie<span className={styles.required}>*</span></label>
        <select id="species" className={`${errors.species ? styles.errorInput : ''}`} {...register("species", { required: "La especie es obligatoria" })}>
          <option value="">Seleccione una especie</option>
          {speciesOptions.map(specie =>
            (<option key={specie.value} value={specie.value}>{specie.label}</option>)
          )}
        </select>
        {errors.species && (
          <p className={styles.errorMsg}>{errors.species.message}</p>
        )}
      </aside>
      <aside className={styles.inputField}>
        <label htmlFor="sex">Sexo<span className={styles.required}>*</span></label>
        <select id="sex" className={`${errors.sex ? styles.errorInput : ''}`}{...register("sex", { required: "El sexo es obligatorio" })}>
          <option value="">Seleccione un sexo</option>
          {sexOptions.map((sex) => (
            <option key={sex.value} value={sex.value}>
              {sex.label}
            </option>
          ))}
        </select>
        {errors.sex && (
          <p className={styles.errorMsg}>{errors.sex.message}</p>
        )}
      </aside>
      {/* Edad */}
      <InputField label="Edad (años)" idInput="age" type="number" register={register} errors={errors} />

      {/* Peso */}
      <InputField
        label="Peso (kg)"
        idInput="weight"
        type="number"
        register={register}
        errors={errors}
      />

      {/* Esterilizado */}
      <aside className={styles.inputField}>
        <label htmlFor="sterilized">¿Está esterilizado?<span className={styles.required}>*</span></label>
        <select
          id="sterilized" className={`${errors.sterilized ? styles.errorInput : ''}`} {...register("sterilized", { required: "Debes indicar si está esterilizado", })}>
          <option value="">Seleccione una opción</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
        {errors.sterilized && (
          <p className={styles.errorMsg}>{errors.sterilized.message}</p>
        )}
      </aside>

      {/* Discapacidad */}
      <InputField
        label="Discapacidad"
        idInput="disability"
        register={register}
        errors={errors}
      />

      {/* Descripción */}
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
        <ButtonComponent type="submit" contain={petSelected ? "Actualizar Mascota" : "Crear Mascota"} loading={loading} />
      </aside>
    </form>
  )
}

const Pets = () => {
  const { user } = useContext(AuthContext);

  const [isModalPetOpen, setIsModalPetOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sexFilter, setSexFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [speciesFilter, setSpeciesFilter] = useState<string>("ALL");
  const [petsData, setPetsData] = useState<PetData[] | undefined>([]);

  const { loading, handleGetPets, handleGetPetsOwner } = usePetService();

  useEffect(() => {
    if (!user) return;

    const fetchPetData = async () => {
      let data;

      if (user.role === "ADMINISTRADOR" || user.role === "VETERINARIO") {
        data = await handleGetPets();
      } else {
        data = await handleGetPetsOwner(user.documentNumber);
      }

      setPetsData(data);
    };

    fetchPetData();
  }, [user]);


  const filteredPets = useMemo(() => {
    return petsData?.filter(({ data: pet }) => {

      const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase())
        || pet.idOwner.includes(searchTerm.toLowerCase())
        || pet.breed.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecies = speciesFilter === 'ALL' || pet.species === speciesFilter;

      const matchesSex = sexFilter === 'ALL'
        || (sexFilter === 'MACHO' && pet.sex === 'MACHO')
        || (sexFilter === 'HEMBRA' && pet.sex === 'HEMBRA')
        || (sexFilter === "INDETERMINADO" && pet.sex === "INDETERMINADO");

      const matchesStatus = statusFilter === 'ALL'
        || (statusFilter === 'ACTIVE' && pet.isActive)
        || (statusFilter === 'INACTIVE' && !pet.isActive);

      return matchesSearch && matchesSpecies && matchesSex && matchesStatus;
    });
  }, [petsData, searchTerm, speciesFilter, sexFilter, statusFilter]);

  if (loading) return (<Spinner/>);

  return (
    <main className={styles.petsContainer}>
      <section className={styles.sectionPets}>
        <h1 className={styles.headerTitle}>Panel de administración - Mascotas</h1>
        <PetsFilters
          searchTerm={searchTerm}
          sexFilter={sexFilter}
          speciesFilter={speciesFilter}
          statusFilter={statusFilter}
          setSearchTerm={setSearchTerm}
          setSexFilter={setSexFilter}
          setSpeciesFilter={setSpeciesFilter}
          setStatusFilter={setStatusFilter}
          setModalClosePet={setIsModalPetOpen}
        />
        <PetCard pets={filteredPets} setPetsData={setPetsData} />
        {isModalPetOpen && (<CreatePetModal setModalCreatePet={setIsModalPetOpen} setPetsData={setPetsData} />)}
      </section>
    </main>
  );
}

const PetCard = ({ pets, setPetsData }: PetCardProps) => {
  const { user } = useContext(AuthContext);

  const [petSelected, setPetSelected] = useState<PetData | undefined>(undefined);
  const [isModalPetEditOpen, setIsModalPetEditOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const { confirmUpdate, confirmDelete } = usePetService();

  const goToPetDetail = (idPet: String) => {
    navigate(`/mascotas/${idPet}`);
  };

  const handleEditPet = (pet: Pet, meta: Meta) => {
    setIsModalPetEditOpen(prev => !prev);
    setPetSelected({ data: pet, meta });
  }

  if (!pets || pets.length === 0) return (<h2>No hay mascotas registradas</h2>);


  const changePetStatus = async (pet: Pet, meta: Meta) => {
    if (await confirmUpdate(pet)) meta.lastUpdate = new Date().toString();
  }

  const deletePet = async (pet: Pet) => {
    const idPet = await confirmDelete(pet);
    if (idPet) setPetsData(prev => prev?.filter(p => p.data.idPet !== idPet));
  };
  return (
    <main className={styles.cardPetsContainer}>
      {pets && pets?.map(({ data: pet, meta }) => (
        <section className={styles.card} key={pet.idPet} onClick={() => goToPetDetail(pet.idPet)}>
          <aside className={styles.cardImageContainer}>
            <img
              src={getPetImage(pet)}
              alt={pet.name}
              className={styles.cardImage}
            />
            <span className={`${styles.statusIndicator} ${pet.isActive ? styles.active : styles.inactive}`}>
              {pet.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </aside>
          <aside className={styles.cardContent}>
            {(user?.role === "ADMINISTRADOR" || user?.role === "VETERINARIO") && (
              <section className={styles.actions}>
                <button
                  title="Editar"
                  className={`${styles.btn} ${styles.edit}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPet(pet, meta)
                  }}>
                  <i className="fa-regular fa-pen-to-square" />
                </button>
                <button
                  title="Eliminar"
                  className={`${styles.btn} ${styles.delete}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePet(pet);
                  }}
                >
                  <i className="fa-regular fa-trash-can" />
                </button>
                <button
                  title="Cambiar Estado"
                  className={`${styles.btn} ${styles.toggleStatus}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    changePetStatus(pet, meta);
                  }}
                >
                  <i className="fa-solid fa-arrows-rotate" />
                </button>
              </section>
            )}
            <h3 className={styles.petName}>{pet.name}</h3>
            <div className={styles.petInfo}>
              <span className={styles.petSpecies}>{pet.species}</span>
              <span className={styles.petSex}>{pet.sex}</span>
              {pet.sterilized && <span className={styles.sterilized}>✂</span>}
            </div>
            <div className={styles.petDetails}>
              <p><strong>Id propietario:</strong> {pet.idOwner}</p>
              <p><strong>Edad:</strong> {pet.age} <span>años</span></p>
              <p><strong>Raza:</strong> {pet.breed || 'Sin definir'}</p>
              <p><strong>Peso:</strong> {pet.weight} <span>kg</span></p>
              <p><strong>Fecha registro:</strong> {new Date(meta.creationDate).toLocaleDateString()}</p>
            </div>
          </aside>
        </section>
      ))}
      {isModalPetEditOpen && (
        <main className={styles.overlay}>
          <section className={styles.modal}>
            <button className={styles.closeButton} onClick={() => setIsModalPetEditOpen && setIsModalPetEditOpen(false)}>x</button>
            <section className={styles.backgroundModalEdit} />
            <FormPet setModalCreatePet={setIsModalPetEditOpen} setPetsData={setPetsData} petSelected={petSelected} />
          </section>
        </main>
      )}
    </main>
  );
};

const getPetImage = (pet: Pet) => {
  if (pet.mediaFile) {
    return `data:${pet.mediaFile.contentType};base64,${pet.mediaFile.attachment}`;
  }
  return defaultPetImage;
}

interface PetsFiltersProps {
  searchTerm: string;
  sexFilter: string;
  speciesFilter: string;
  statusFilter: string;
  setSearchTerm: (term: string) => void;
  setSexFilter: (filter: string) => void;
  setStatusFilter: (filter: string) => void;
  setSpeciesFilter: (filter: string) => void;
  setModalClosePet: (close: boolean) => void;
}

const PetsFilters = ({
  searchTerm,
  sexFilter,
  speciesFilter,
  statusFilter,
  setSearchTerm,
  setSexFilter,
  setStatusFilter,
  setSpeciesFilter,
  setModalClosePet
}: PetsFiltersProps) => (
  <section className={styles.filters}>
    <SearchBar
      placeholder="Buscar por nombre, raza o Id propietario..."
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    />
    <aside className={styles.selectFilters}>
      <button className={styles.btnCreateUser} onClick={() => setModalClosePet(true)}>Registrar mascota</button>
      <select
        value={speciesFilter}
        onChange={(e) => setSpeciesFilter(e.target.value)}
        className={styles.filterSelect}
      >
        <option value="ALL">Todas las especies</option>
        {species.map(specie =>
          (<option key={specie.value} value={specie.value}>{specie.label}</option>)
        )}
      </select>
      <select
        value={sexFilter}
        onChange={(e) => setSexFilter(e.target.value)}
        className={styles.filterSelect}
      >
        {sexOptionsFilter.map(sex => (
          <option key={sex.value} value={sex.value}>
            {sex.label}
          </option>
        ))}
      </select>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
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

const InputField = ({
  label,
  type = "text",
  idInput,
  required = true,
  inputFull = false,
  register,
  errors
}: InputFieldPetRegister) => {

  const fieldValidation = validationRules[idInput] as RegisterOptions<Pet, typeof idInput>;

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

const speciesOptions = [
  { value: "PERRO", label: "Perro" },
  { value: "GATO", label: "Gato" },
  { value: "ROEDOR", label: "Roedor" },
  { value: "AVE", label: "Ave" },
  { value: "REPTIL", label: "Reptil" },
  { value: "PESCADO", label: "Pescado" }
];

const sexOptions = [
  { value: "MACHO", label: "Macho" },
  { value: "HEMBRA", label: "Hembra" },
  { value: "INDETERMINADO", label: "Indeterminado" },
];

export default Pets;