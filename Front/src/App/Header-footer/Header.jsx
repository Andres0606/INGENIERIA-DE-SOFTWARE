import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../Components/Header.css';

const Header = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Verificar si el usuario está logueado
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      const user = sessionStorage.getItem('userData');
      
      setIsLoggedIn(loggedIn);
      if (user) {
        setUserData(JSON.parse(user));
      }
    };

    checkAuth();
    
    // Escuchar cambios en el storage
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    // Limpiar sessionStorage
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userEmail');
    
    // Limpiar estados
    setIsLoggedIn(false);
    setUserData(null);
    
    // Redirigir al inicio
    navigate('/');
    
    // Recargar para actualizar el header
    window.location.reload();
  };

  // Verificar si el usuario es emprendedor (idtipousuario = 2)
  const isEmprendedor = userData && userData.idtipousuario === 2;

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

        {/* Auth Buttons - MEJORADO */}
        <div className="auth-buttons">
          {isLoggedIn ? (
            // ✅ Usuario LOGUEADO - Mostrar Mis Emprendimientos, Perfil y Cerrar Sesión
            <>
              {/* Botón "Mis Emprendimientos" solo para emprendedores */}
              {isEmprendedor && (
                <Link to="/mis-emprendimientos" className="btn-emprendimientos">
                  🛍 Mis Emprendimientos
                </Link>
              )}
              
              <Link to="/perfil" className="btn-profile">
                👤 Perfil
                {userData && (
                  <span className="user-name">
                    {userData.nombres}
                  </span>
                )}
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="btn-logout"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            // ❌ Usuario NO logueado - Mostrar Login y Registro
            <>
              <Link to="/login" className="btn-login">Iniciar Sesión</Link>
              <Link to="/register" className="btn-register">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;