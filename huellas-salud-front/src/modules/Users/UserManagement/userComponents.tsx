import React, { memo, useCallback, useState } from "react";
import { CreateUserModalProps, EditUserModalProps, InputEditProps, Meta, Role, SearchBarProps, User, UserFiltersProps, UserTableProps } from "../../../helper/typesHS";
import { formatDate, metaEmpty, roles, statusOptions, tableColumns, userEmpty } from "./usersUtils";
import { useUserService } from "./usersService";
import { FormUser } from "../UserRegister/userRegisterComponenets";
import styles from "./users.module.css";

export const UserFilters = ({
    searchTerm,
    roleFilter,
    statusFilter,
    setModalCreateClose,
    onSearchChange,
    onRoleFilterChange,
    onStatusFilterChange
}: UserFiltersProps) => (
    <section className={styles.filters}>
        <SearchBar
            placeholder="Buscar por nombre o email..."
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
        />

        <aside className={styles.selectFilters}>
            <button className={styles.btnCreateUser} onClick={() => setModalCreateClose(true)}>Registrar usuario</button>
            <select
                value={roleFilter}
                onChange={(e) => onRoleFilterChange(e.target.value)}
                className={styles.filterSelect}
            >
                <option value="ALL">Todos los roles</option>
                {roles.filter(role => role !== 'ALL').map(role => (
                    <option key={role} value={role}>
                        {role.charAt(0) + role.slice(1).toLowerCase()}
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

export const UserTable = ({ users, setUsersData }: UserTableProps) => {

    const { confirmDelete, confirmUpdate } = useUserService();

    const [userSelected, setUserSelected] = useState<User>(userEmpty);
    const [metaSelected, setMetaSelected] = useState<Meta>(metaEmpty);
    const [isModalEditOpen, setIsModalEditOpen] = useState<boolean>(false);

    const changeUserStatus = async (user: User, meta: Meta) => {
        if (await confirmUpdate(user, "estado")) meta.lastUpdate = new Date().toString();
    }

    const deleteUser = async (user: User) => {
        const idUser = await confirmDelete(user);
        if (idUser) setUsersData(prev => prev?.filter(u => u.data.documentNumber !== idUser));
    };

    const handleEditUser = (user: User, meta: Meta) => {
        setIsModalEditOpen(prev => !prev);
        setUserSelected(user);
        setMetaSelected(meta);
    }

    return (
        <section className={styles.tableContainer}>
            <table className={styles.userTable}>
                <thead>
                    <tr>
                        {tableColumns.map(column => (<th key={column}>{column}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {users?.map(({ data: user, meta }) => (
                        <tr key={`${user.documentType}-${user.documentNumber}`}>
                            <td>
                                <aside className={styles.userInfo}>
                                    <button className={styles.avatar}>
                                        <UserAvatar user={user} />
                                    </button>
                                    <div className={styles.userDetails}>
                                        <span className={styles.userName}>
                                            {user.name.split(' ')[0]} {user.lastName.split(' ')[0]}
                                        </span>
                                        <span className={styles.userDate}>
                                            Registro: {new Date(meta.creationDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </aside>
                            </td>
                            <td style={{ fontWeight: 600 }}>{user.documentType}.</td>
                            <td>{user.documentNumber}</td>
                            <td>
                                <span className={`${styles.roleBadge} ${styles[user.role.toLowerCase()]}`}>
                                    {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                                </span>
                            </td>
                            <td>{user.cellPhone}</td>
                            <td>{user.email}</td>
                            <td>
                                <span className={`${styles.status} ${user.active ? styles.active : styles.inactive}`}>
                                    {user.active ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            <td>
                                <aside className={styles.actions}>
                                    <button
                                        title="Editar"
                                        className={`${styles.btn} ${styles.edit}`}
                                        onClick={() => handleEditUser(user, meta)}
                                    >
                                        <i className="fa-regular fa-pen-to-square" />
                                    </button>
                                    <button
                                        title="Eliminar"
                                        className={`${styles.btn} ${styles.delete}`}
                                        onClick={() => deleteUser(user)}
                                    >
                                        <i className="fa-regular fa-trash-can" />
                                    </button>
                                    <button
                                        title="Cambiar Estado"
                                        className={`${styles.btn} ${styles.toggleStatus}`}
                                        onClick={() => changeUserStatus(user, meta)}
                                    >
                                        <i className="fa-solid fa-power-off" />
                                    </button>
                                </aside>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalEditOpen && (
                <EditUserModal
                    user={userSelected}
                    meta={metaSelected}
                    setCloseModal={setIsModalEditOpen}
                    confirmUpdate={confirmUpdate}
                />
            )}
        </section>
    );
}

export const UserAvatar = ({ user }: { user: User }) => {

    if (user.mediaFile) {
        return (<img src={`data:${user.mediaFile.contentType};base64,${user.mediaFile.attachment}`} alt={user.name} />);
    }

    const initials = user.name.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase();
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#A37AFC', '#FFA07A'];
    const color = colors[initials.charCodeAt(0) % colors.length];

    return (
        <div className={`${styles.initialsAvatar}`} style={{ backgroundColor: color }}>
            {initials}
        </div>
    );
}

const EditUserModal = ({ user, meta, setCloseModal, confirmUpdate }: EditUserModalProps) => {

    const [roleSelected, setRolSelected] = useState<string>(user.role);

    const handleUpdate = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();

            if (roleSelected !== user.role) {
                user.role = roleSelected as Role;
                meta.lastUpdate = new Date().toString();
                await confirmUpdate(user, "rol") && setCloseModal(false);
            }
        },
        [roleSelected, user, meta, confirmUpdate, setCloseModal]
    );

    return (
        <main className={styles.overlay}>
            <section className={styles.modal}>
                <section className={styles.backgroundModalEdit} />
                <section className={styles.imgDataUser}>
                    <UserAvatar user={user} />
                    <section className={styles.sectionMetaUser}>
                        <h2>{user.name} {user.lastName}</h2>
                        <span>{user.email}</span>
                        <aside className={styles.asideMeta}>
                            <p>
                                <span className={styles.metaUser}>Fecha registro</span>:{' '}
                                {formatDate(meta.creationDate)}
                            </p>
                            <p>
                                <span className={styles.metaUser}>Ult. actualización</span>:{' '}
                                {meta.lastUpdate ? formatDate(meta.lastUpdate) : "---"}
                            </p>
                        </aside>
                    </section>
                </section>
                <form className={styles.formEditUser} onSubmit={handleUpdate}>
                    <button className={styles.closeButton} onClick={() => setCloseModal(false)}>x</button>
                    <InputEdit label="Tipo de Documento" value={user?.documentType} />
                    <InputEdit label="Número de Documento" value={user?.documentNumber} />
                    <InputEdit label="Teléfono" value={user?.cellPhone} />
                    <InputEdit label="Dirección" value={user?.address} />
                    <InputEdit label="Estado" value={user?.active ? "Activo" : "Inactivo"} />
                    <aside className={`${styles.fieldGroup}`}>
                        <label>Rol</label>
                        <select
                            required
                            defaultValue={user?.role}
                            className={styles.selectRolEdit}
                            onChange={(e) => setRolSelected(e.target.value as Role)}
                        >
                            {roles.map(role =>
                                (<option disabled={role === user.role} key={role} value={role}>{role}</option>))
                            }
                        </select>
                    </aside>
                    <aside className={styles.buttonGroup}>
                        <button className={styles.cancelButton} onClick={() => setCloseModal(false)}>Cancelar</button>
                        <button className={styles.updateButton} type="submit">Actualizar</button>
                    </aside>
                </form>
            </section>
        </main>
    );
}

export const CreateUserModal = ({ setModalCreate, setUsersData }: CreateUserModalProps) => {

    return (
        <main className={styles.overlay}>
            <section className={styles.modal}>
                <button className={styles.closeButton} onClick={() => setModalCreate && setModalCreate(false)}>x</button>
                <section className={styles.backgroundModalEdit} />
                <FormUser isAdmin setModalCreate={setModalCreate} setUsersData={setUsersData} />
            </section>
        </main>
    );
}

const InputEdit = memo(
    ({ label, value, isEditable = true }: InputEditProps) => (
        <aside className={styles.fieldGroup}>
            <label>{label}</label>
            <input value={value} disabled={isEditable} />
        </aside>
    )
);