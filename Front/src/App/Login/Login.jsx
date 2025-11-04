import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../Components/Login.css';
import Header from '../Header-footer/Header.jsx';
import Footer from '../Header-footer/Footer.jsx';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    recordar: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Datos para el login
      const loginData = {
        correo: formData.email,
        contrasena: formData.password
      };

      console.log('Enviando datos de login:', loginData);

      const API_URL = 'http://localhost:3000/api/usuarios/login';
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      console.log('Respuesta recibida:', response);

      const data = await response.json();
      console.log('Datos recibidos:', data);

      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      if (data.success) {
        // ✅ GUARDAR EN SESSIONSTORAGE - Aquí sí es correcto
        sessionStorage.setItem('userToken', 'authenticated'); // Podrías usar un token real si tu backend lo genera
        sessionStorage.setItem('userData', JSON.stringify(data.data));
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', formData.email);
        
        // Guardar preferencia de "recordarme"
        if (formData.recordar) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('savedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('savedEmail');
        }

        console.log('Login exitoso, usuario guardado:', data.data);
        
        // Redirigir al dashboard o página principal
        alert(`¡Bienvenido ${data.data.nombres}!`);
        navigate('/'); // Cambia por tu ruta principal después del login
      } else {
        setError(data.message || 'Error en el login');
      }
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.message || 'Error de conexión. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const handleVolverMenu = () => {
    navigate('/');
  };

  // Cargar email guardado si existe
  React.useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('savedEmail');
    
    if (rememberMe === 'true' && savedEmail) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        recordar: true
      }));
    }
  }, []);

  // Función para probar conexión (opcional)
  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:3000');
      const data = await response.json();
      console.log('Conexión exitosa:', data);
      alert('✅ Conexión con el backend exitosa');
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('❌ No se pudo conectar con el backend');
    }
  };

  return (
    <>
    <Header></Header>
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

          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #ffcdd2',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

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
                minLength="6"
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

            <button 
              type="submit" 
              className="btn-Inicio"
              disabled={loading}
            >
              {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              ¿No tienes cuenta? {' '}
              <Link to="/register" className="link-registro">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

export default Login;