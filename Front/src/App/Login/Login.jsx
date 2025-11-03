import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Components/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    recordar: false
  });

  const navigate = useNavigate(); // 👈 Hook para redirigir

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Datos de login:', formData);

    // 👇 Redirige al formulario de registro
    navigate('/register');
  };

  const handleVolverMenu = () => {
    navigate('/'); // Regresa al menú principal
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button className="btn-volver" onClick={handleVolverMenu}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver al menú
        </button>

        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span>U</span>
            </div>
            <h1 className="login-title">Emprende UCC</h1>
            <p className="login-subtitle">Inicia sesión para conectar con emprendedores</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="recordar"
                  checked={formData.recordar}
                  onChange={handleChange}
                />
                <span>Recordarme</span>
              </label>
              <a href="#" className="link-recuperar">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="btn-Inicio">
              Iniciar Sesión
            </button>
          </form>

          <div className="login-footer">
            <p>
              ¿No tienes cuenta? <a href="#" className="link-registro">Regístrate aquí</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
