import { useState } from "react";
import styles from "./navbar.module.css";
import { BtnsLogRegister, Logo, NavLinks, SearchBar, SubMenu } from "./NavbarComponents";

const Navbar = () => {

  const [showSubMenu, setShowSubMenu] = useState<boolean>(false);
  const [optionHover] = useState<string>("Perros");

  return (
    <>
      <nav className={styles.navbar}>
        <Logo />
        <aside>
          <SearchBar />
          <NavLinks />
        </aside>
        <BtnsLogRegister />
      </nav>
      {showSubMenu && <SubMenu option={optionHover} setShowSubMenu={setShowSubMenu} />}
    </>
  );
}

export default Navbar;