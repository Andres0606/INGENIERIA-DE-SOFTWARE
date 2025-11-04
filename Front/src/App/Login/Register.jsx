import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../Components/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    carrera: '',
    telefono: '',
    fechaNacimiento: '',
    tipoUsuario: '',
    acceptTerms: false
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

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      setLoading(false);
      return;
    }

    try {
      // Mapear los datos del formulario
      const userData = {
        nombres: formData.nombre,
        apellidos: formData.apellido,
        correo: formData.email,
        contrasena: formData.password,
        idcarrera: formData.carrera ? parseInt(formData.carrera) : null,
        telefono: formData.telefono || null,
        idtipousuario: formData.tipoUsuario === 'emprendedor' ? 2 : 3,
        tipodocumento: null,
        numdocumento: null
      };

      console.log('Enviando datos:', userData);

      const API_URL = 'http://localhost:3000/api/usuarios/registro';
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Respuesta recibida:', response);

      const data = await response.json();
      console.log('Datos recibidos:', data);

      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      if (data.success) {
        // ✅ SOLO redirigir a login - NO sessionStorage aquí
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        setError(data.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.message || 'Error de conexión. Verifica que el servidor esté corriendo en http://localhost:3000');
    } finally {
      setLoading(false);
    }
  };

  // Función para probar la conexión con el backend
  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:3000');
      const data = await response.json();
      console.log('Conexión exitosa:', data);
      alert('✅ Conexión con el backend exitosa');
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('❌ No se pudo conectar con el backend. Verifica que esté corriendo en http://localhost:3000');
    }
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <button 
          className="register-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Volver al menú
        </button>

        <div className="register-header">
          <div className="register-logo">U</div>
          <div className="register-title">
            <h1>Emprende UCC</h1>
            <p>Únete a la comunidad de innovadores</p>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ffcdd2'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form-content">
          <div className="register-field">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Apellido *</label>
            <input
              type="text"
              name="apellido"
              placeholder="Tu apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Correo Electrónico *</label>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Contraseña *</label>
            <input
              type="password"
              name="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="register-field">
            <label>Confirmar Contraseña *</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Carrera</label>
            <select
              name="carrera"
              value={formData.carrera}
              onChange={handleChange}
            >
              <option value="">Selecciona tu carrera</option>
              <option value="1">Derecho</option>
              <option value="2">Ingeniería de sistemas</option>
              <option value="3">Ingeniería civil</option>
              <option value="4">Contaduría</option>
              <option value="5">Administración de empresas</option>
              <option value="6">Medicina veterinaria y zootecnia</option>
              <option value="7">Psicología</option>
              <option value="8">Medicina</option>
              <option value="9">Enfermería</option>
              <option value="10">Odontología</option>
              <option value="11">Ninguna</option>
            </select>
          </div>

          <div className="register-field">
            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              placeholder="3001234567"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="register-field">
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
            />
          </div>

          <div className="register-field">
            <label>Tipo de Usuario *</label>
            <select
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un rol</option>
              <option value="emprendedor">Emprendedor</option>
              <option value="miembro">Miembro UCC</option>
            </select>
          </div>

          <div className="register-terms">
            <input
              type="checkbox"
              id="terms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
            />
            <label htmlFor="terms">
              Acepto los <a href="#">Términos de Servicio</a> y <a href="#">Política de Privacidad</a>
            </label>
          </div>

          <button 
            type="submit" 
            className="register-submit"
            disabled={loading}
          >
            {loading ? 'Creando Cuenta...' : 'Crear Cuenta'}
          </button>

          <p className="register-login-link">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;