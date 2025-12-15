import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext, ListItemNavProps, SubMenuProps, User } from "../../helper/typesHS";
import { MENU_DATA } from "./navbarData";
import { UserAvatar } from "../Users/UserManagement/userComponents";
import imgHS1 from "../../assets/Huellas&Salud_4.png";
import styles from "./navbar.module.css";
import { metaEmpty } from "./../Users/UserManagement/usersUtils";
import { FormUser } from "../Users/UserRegister/userRegisterComponenets";

export const Logo = () => (
    <picture className={styles.logoContain}>
        <Link to={"/"}>
            <img src={imgHS1} alt="Huellas&Salud" />
        </Link>
    </picture>
);

export const SearchBar = () => (
    <aside className={styles.asideInput}>
        <input type="search" placeholder="¿Qué necesita tu mascota?" />
        <button>Buscar</button>
    </aside>
);

export const NavLinks = () => {

    const { user } = useContext(AuthContext);

    return (
        <ul className={styles.containerUl}>
            {/* <ListItemNav
                path="/mascotas/perros"
                name="Perros"
                icon="fa-solid fa-dog"
                setOptionHover={setOptionHover}
                setShowSubMenu={setShowSubMenu}
            />
            <ListItemNav
                path="/mascotas/gatos"
                name="Gatos"
                icon="fa-solid fa-cat"
                setOptionHover={setOptionHover}
                setShowSubMenu={setShowSubMenu}
            /> */}
            <ListItemNav path="/" name="Inicio" icon="fa-solid fa-house" />
            <ListItemNav path="/productos" name="Productos" icon="fa-solid fa-boxes-stacked" />
            <ListItemNav path="/servicios" name="Servicios" icon="fa-solid fa-house-laptop" />
            {
                hasRole(user, ["ADMINISTRADOR"]) && (
                    <ListItemNav path="/usuarios" name="Usuarios" icon="fa-solid fa-users" />
                )
            }
            {
                hasRole(user, ["ADMINISTRADOR", "VETERINARIO", "CLIENTE"]) && (
                    <>
                        <ListItemNav path="/mascotas" name="Mascotas" icon="fa-solid fa-paw" />
                    </>
                )
            }
            <ListItemNav path="/contacto" name="Contacto" icon="fa-solid fa-mobile-screen-button" />
        </ul>
    );
};

const ListItemNav = ({ path, style, icon, name, setOptionHover, setShowSubMenu }: ListItemNavProps) => {

    const handleMouseEnter = () => {
        setOptionHover?.(name);
        setShowSubMenu?.(true);
    };

    const handleMouseLeave = () => setShowSubMenu?.(false);
    const getClassName = ({ isActive }: { isActive: boolean }) => isActive ? styles.active : styles.disabled;
    const linkStyle = style ? { textDecoration: "none" } : undefined;

    return (
        <li className={styles.liNav}>
            <NavLink
                to={path}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={getClassName}
                style={linkStyle}
            >
                <i className={icon} />
                {name}
            </NavLink>
        </li>
    )
};

export const BtnsLogRegister = () => {
    const { user, logout } = useContext(AuthContext);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const userSelected = user ? { data: user, meta: metaEmpty } : undefined;
    const [openModal, setOpenModal] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setOpenModal(false);
    };

    const handleProductsAdmin = () => {
        navigate("/productos-admin");
    };

    const handleServicesAdmin = () => {
        navigate("/servicios-admin");
    };

    const handleAppointmentsAdmin = () => {
        navigate("/citas");
    };

    const handleAnnouncementsAdmin = () => {
        navigate("/anuncios");
    };

    const handleInvoices = () => {
        navigate("/facturas");
    };

    const handleSchedules = () => {
        navigate("/horarios");
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setOpenModal(false);
        }
    };

    useEffect(() => {
        if (openModal) document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openModal]);

    if (!user) {
        return (
            <aside className={styles.asideButtons}>
                <Link to="/login">
                    <button type="button">Iniciar sesión</button>
                </Link>
                <Link to="/registro-usuario">
                    <button type="button">Crear cuenta</button>
                </Link>
                <Link to="https://drive.google.com/drive/folders/1WWYAltuD5Hiedk_3CaszyOZIoqcEc2ie?usp=drive_link">
                    <button type="button" className={styles.btnMobile}>Aplicación Móvil</button>
                </Link>
            </aside>
        );
    }

    return (
        <>
            <aside className={styles.asideButtons}>
                <button
                    className={styles.avatarButton}
                    onClick={() => setOpenModal(prev => !prev)}
                    title={`${user.name} ${user.lastName}`}
                >
                    <UserAvatar user={user} />
                </button>

                {openModal && (
                    <section className={styles.dropdown} ref={dropdownRef}>
                        <button className={styles.closeButton} onClick={() => setOpenModal(false)}>×</button>
                        <div className={styles.profileSection}>
                            <UserAvatar user={user} />
                            <p className={styles.userName}>{`${user.name} ${user.lastName}`}</p>
                        </div>
                        <button className={styles.editButton}  onClick={() => setIsModalEditOpen(true)}>Editar perfil</button>
                        {
                            hasRole(user, ["ADMINISTRADOR"]) && (
                                <button className={styles.btnProducts} onClick={handleProductsAdmin}>Productos</button>
                            )
                        }
                        {
                            hasRole(user, ["ADMINISTRADOR"]) && (
                                <button className={styles.btnProducts} onClick={handleServicesAdmin}>Servicios</button>
                            )
                        }
                        {
                            hasRole(user, ["ADMINISTRADOR"]) && (
                                <button className={styles.btnProducts} onClick={handleAnnouncementsAdmin}>Anuncios</button>
                            )
                        }
                        <button className={styles.btnProducts} onClick={handleAppointmentsAdmin}>Citas</button>
                        {
                            hasRole(user, ["ADMINISTRADOR", "CLIENTE"]) && (
                                <button className={styles.btnProducts} onClick={handleInvoices}>Facturas</button>
                            )
                        }
                        {
                            hasRole(user, ["ADMINISTRADOR"]) && (
                                <button className={styles.btnProducts} onClick={handleSchedules}>Horarios</button>
                            )
                        }
                        <button className={styles.logoutButton} onClick={handleLogout}>
                            Cerrar sesión
                        </button>
                    </section>
                )}
            </aside>
            {
                isModalEditOpen && userSelected && (
                    <main className={styles.overlay}>
                        <section className={styles.modal}>
                            <button
                                className={styles.closeButton}
                                onClick={() => setIsModalEditOpen(false)}
                            >
                                ×
                            </button>
                            <section className={styles.backgroundModalEdit} />
                            <aside className={styles.containerForm}>
                                <FormUser
                                    isAdmin={false}
                                    setModalCreate={setIsModalEditOpen}
                                    userSelected={userSelected}
                                />
                            </aside>
                        </section>
                    </main>
                )
            }
        </>
    );
}

export const SubMenu = ({ option, setShowSubMenu }: SubMenuProps) => {

    const data = useMemo(() => MENU_DATA[option as keyof typeof MENU_DATA], [option]);

    if (!data) return null;

    const handleMouse = (show: boolean) => setShowSubMenu?.(show);

    return (
        <section className={styles.optionMenu}
            onMouseEnter={() => handleMouse(true)}
            onMouseLeave={() => handleMouse(false)}
        >
            <aside className={styles.optionCategory}>
                <ul>
                    {data.categories.map((category) => (
                        <li key={category.name}><i className={category.img} /> {category.name}</li>
                    ))}
                    <li>
                        <Link to={"/productos"}>
                            <i className="fa-solid fa-angle-right" />
                            Ver todos
                        </Link>
                    </li>
                </ul>
            </aside>
            {/* <aside className={styles.optionMain}>
                {data.options.map((optCat) => (
                    <section key={optCat.name}>
                        {option === "Otras Mascotas" && (<img src={imgHS2} alt={optCat.name} />)}
                        <h3>{optCat.name}</h3>
                        <ul>
                            {optCat.options.map((opt) => (<li key={opt}>{opt}</li>))}
                        </ul>
                    </section>
                ))}
            </aside> */}
            <aside className={styles.optionBrands}>
                <ul>
                    <li><strong>Marcas populares</strong></li>
                    {data.popular.map((brand) => (
                        <li key={brand.name}>
                            <picture><img src={brand.img} alt={brand.name} /></picture>
                        </li>
                    ))}
                </ul>
            </aside>
        </section>
    )
};

const hasRole = (user: User | null, roles: string[]): boolean => {
    return !!user && roles.includes(user.role);
}