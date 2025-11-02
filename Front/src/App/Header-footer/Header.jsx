import React, { useState } from 'react';
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
          <a href="#inicio" className="nav-link">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 7l7-5 7 5v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Inicio
          </a>
          <a href="#emprendedores" className="nav-link">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 16v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Emprendedores
          </a>
          <a href="#productos" className="nav-link">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2h3l2 9h7l3-7H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Productos
          </a>
          <a href="#eventos" className="nav-link">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 2v4M6 2v4M2 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Eventos
          </a>
          <a href="#contacto" className="nav-link">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M16 11V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 6l7 4 7-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Contacto
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <button className="btn-login">Iniciar Sesión</button>
          <button className="btn-register">Registrarse</button>
        </div>
      </div>
    </header>
  );
};

export default Header;