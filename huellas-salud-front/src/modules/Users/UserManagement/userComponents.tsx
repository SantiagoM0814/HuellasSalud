import { useContext, useState } from "react";
import { AuthContext, CreateUserModalProps, Meta, SearchBarProps, User, UserData, UserFiltersProps, UserTableProps } from "../../../helper/typesHS";
import { roles, statusOptions, tableColumns } from "./usersUtils";
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
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === "ADMINISTRADOR" ? true : false;
    const { confirmDelete, confirmUpdate } = useUserService();

    const [userSelected, setUserSelected] = useState<UserData | undefined>(undefined)
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
        setUserSelected({ data: user, meta});
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
                <main className={styles.overlay}>
                    <section className={styles.modal}>
                        <button className={styles.closeButton} onClick={() => setIsModalEditOpen && setIsModalEditOpen(false)}>x</button>
                        <section className={styles.backgroundModalEdit} />
                        <FormUser isAdmin={isAdmin} setModalCreate={setIsModalEditOpen} setUsersData={setUsersData} userSelected={userSelected} />
                    </section>
                </main>
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

