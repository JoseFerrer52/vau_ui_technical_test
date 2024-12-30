import { useState } from "react";
import "../style/header.css";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <a href="/home" className="header-link">
        <div className="header-logo">listUser</div>
      </a>
      <div className="header-menu">
        <button className="menu-button" onClick={toggleMenu}>
          Menu
        </button>
        {menuOpen && (
          <div className="menu-dropdown">
            <a href="/edit-profile" className="menu-item">
              Editar Perfil
            </a>
            <a href="/logout" className="menu-item">
              Cerrar Sesión
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
