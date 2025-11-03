import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <button className="register-back-btn">
          ← Volver al menú
        </button>

        <div className="register-header">
          <div className="register-logo">U</div>
          <div className="register-title">
            <h1>Emprende UCC</h1>
            <p>Únete a la comunidad de innovadores</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="register-form-content">
          <div className="register-field">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="register-field">
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              placeholder="Tu apellido"
              value={formData.apellido}
              onChange={handleChange}
            />
          </div>

          <div className="register-field">
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="register-field">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="········"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="register-field">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="········"
              value={formData.confirmPassword}
              onChange={handleChange}
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
              <option value="derecho">Derecho</option>
              <option value="ingenieria-sistemas">Ingeniería de sistemas</option>
              <option value="ingenieria-civil">Ingeniería civil</option>
              <option value="contaduria">Contaduría</option>
              <option value="administracion-empresas">Administración de empresas</option>
              <option value="medicina-veterinaria">Medicina veterinaria y zootecnia</option>
              <option value="psicologia">Psicología</option>
              <option value="medicina">Medicina</option>
              <option value="enfermeria">Enfermería</option>
              <option value="odontologia">Odontología</option>
              <option value="ninguna">Ninguna</option>
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
            <label>Tipo de Usuario</label>
            <select
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
            >
              <option value="">Selecciona un rol</option>
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
              <option value="emprendedor">Emprendedor</option>
              <option value="mentor">Mentor</option>
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

          <button type="submit" className="register-submit">
            Crear Cuenta
          </button>

          <p className="register-login-link">
            ¿Ya tienes cuenta? <a href="#">Inicia sesión aquí</a>
          </p>

          <div className="register-divider">
            <span>O regístrate con</span>
          </div>

          <div className="register-social">
            <button type="button" className="social-btn google">
              <span>Google</span>
            </button>
            <button type="button" className="social-btn microsoft">
              <span>Microsoft</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;