import { FormUserProps, InputFieldUserRegister, User } from "../../../helper/typesHS";
import { SocialMediaIcons } from "../../Login/LoginComponents";
import { RegisterOptions } from "react-hook-form";
import { validationRules } from "./validationRulesUserRegister";
import { useUserRegister } from "./userRegisterService";
import ButtonComponent from "../../../components/Button/Button";
import styles from "./userRegister.module.css";

export const FormUserRegister = () => (
    <section className={styles.containerForm}>
        <FormUser isAdmin={false} />
    </section>
);

export const FormUser = ({ isAdmin, setModalCreate, setUsersData }: FormUserProps) => {

    const {
        errorMsg, handleCreateUserSubmit, loading, register, errors,
        handleSubmit, previewImg, fileInput, fileName, handleChangeImg
    } = useUserRegister({ setModalCreate, setUsersData });

    const handelClicCancel = () => setModalCreate && setModalCreate(false);

    return (
        <form
            className={`${isAdmin ? styles.formAdmin : styles.formRegister}`}
            onSubmit={handleSubmit(handleCreateUserSubmit)}
        >
            <section className={`${isAdmin ? styles.selectImgAdmin : styles.selectImg}`}>
                <label
                    htmlFor="loadImg"
                    className={styles.initialsAvatar}
                    style={previewImg ? { backgroundImage: `url(${previewImg})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                >
                    {!previewImg && (<i className="fa-solid fa-user-tie" />)}
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
            <InputField label="Nombre" idInput="name" register={register} errors={errors} isAdmin={isAdmin} />
            <InputField label="Apellido" idInput="lastName" register={register} errors={errors} isAdmin={isAdmin} />
            <section className={`${isAdmin ? styles.inputAdmin : styles.inputField}`} {...register("documentType")}>
                <label htmlFor="docType">
                    Tipo de documento
                    <span className={styles.required}>*</span>
                </label>
                <select defaultValue={'CC'} id="docType" className={styles.form_input} required>
                    <option value="CC">Cédula de ciudadania</option>
                    <option value="CE">Cédula de extranjeria</option>
                    <option value="PEP">Permiso especial de permanencia</option>
                    <option value="PPT">Permiso protección temporal</option>
                    <option value="PA">Pasaporte</option>
                    <option value="TI">Tarjeta de identidad</option>
                </select>
            </section>
            <InputField
                label="Número de documento"
                type="number"
                idInput="documentNumber"
                register={register}
                errors={errors}
                isAdmin={isAdmin}
            />
            <InputField
                label="Correo"
                type="email"
                idInput="email"
                register={register}
                errors={errors}
                isAdmin={isAdmin}
            />
            <InputField
                label="Teléfono"
                type="number"
                idInput="cellPhone"
                register={register}
                errors={errors}
                isAdmin={isAdmin}
            />
            <InputField
                label="Dirección de residencia"
                idInput="address"
                inputFull={!isAdmin}
                required={false}
                register={register}
                errors={errors}
                isAdmin={isAdmin}
            />
            <InputField
                label="Contraseña"
                type="password"
                idInput="password"
                register={register}
                errors={errors}
                isAdmin={isAdmin}
            />
            <InputField
                label="Confirmar contraseña"
                type="password"
                idInput="confirmPassword"
                register={register}
                errors={errors}
                isAdmin={isAdmin}
            />

            <p className={`${styles.inputFull} ${styles.errorMsg}`}>
                {(Object.keys(errors).length > 0 && "⚠️ Por favor corrige los errores en el formulario ⚠️")}
                {errorMsg ? `⚠️ ${errorMsg} ⚠️` : ""}
            </p>

            <aside className={`${isAdmin ? styles.btnsAdmin : styles.containerButtons} ${styles.inputFull}`}>
                {isAdmin && (
                    <ButtonComponent
                        type="button"
                        contain={"Cancelar"}
                        loading={loading}
                        handleClic={handelClicCancel}
                    />
                )}
                <ButtonComponent type="reset" contain={"Limpiar"} loading={loading} />
                <ButtonComponent type="submit" contain={"Crear cuenta"} loading={loading} />
            </aside>
        </form>
    )
};

export const InfoUserRegister = () => (
    <aside className={styles.userRegisterData}>
        <p className={styles.slogan}>¡Únete a la familia de Huellas y Salud!</p>
        <p>Regístrate en nuestro sistema y accede a un mundo de cuidados especializados para tu mascota.</p>
        <SocialMediaIcons />
    </aside>
);

const InputField = ({
    label,
    type = "text",
    idInput,
    isAdmin,
    required = true,
    inputFull = false,
    register,
    errors
}: InputFieldUserRegister) => {

    const fieldValidation = validationRules[idInput] as RegisterOptions<User, typeof idInput>;

    return (
        <section className={`${isAdmin ? styles.inputAdmin : styles.inputField} ${inputFull && styles.inputFull}`}>
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
            <span className={isAdmin ? styles.validationAdmin : styles.validationError}>
                {errors[idInput]?.message as string}
            </span>
        </section >
    );
};
