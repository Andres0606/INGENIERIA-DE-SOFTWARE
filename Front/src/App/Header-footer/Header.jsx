import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../Components/Header.css';

const Header = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <div className="logo-icon">U</div>
          <span className="logo-text">Emprende UCC</span>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/emprendedores" className="nav-link">Emprendedores</Link>
          <Link to="/productos" className="nav-link">Productos</Link>
          <Link to="/eventos" className="nav-link">Eventos</Link>
          <Link to="/contactos" className="nav-link">Contactos</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <Link to="/login" className="btn-login">Iniciar Sesión</Link>
          <Link to="/register" className="btn-register">Registrarse</Link>
                  </div>
      </div>
    </header>
  );
};

export default Header;
