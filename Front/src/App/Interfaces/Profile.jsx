import React, { useState } from 'react';
import '../../Components/Profile.css';
import Header from '../Header-footer/Header.jsx';
import Footer from '../Header-footer/Footer.jsx';
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    nombre: 'Juan Carlos',
    apellido: 'Rodríguez',
    email: 'juan.rodriguez@ucc.edu.co',
    telefono: '3001234567',
    carrera: 'Ingeniería de Sistemas',
    tipoUsuario: 'Estudiante',
    fechaNacimiento: '1998-05-15',
    fechaRegistro: '2024-01-15'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Datos guardados:', userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
    <Header></Header>
    <div className="profile-container">
      <div className="profile-card">
        <button className="back-button">
          ← Volver al menú
        </button>

        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {userData.nombre.charAt(0)}{userData.apellido.charAt(0)}
            </div>
          </div>
          <div className="profile-title">
            <h1>{userData.nombre} {userData.apellido}</h1>
            <p className="profile-role">{userData.tipoUsuario}</p>
          </div>
          {!isEditing && (
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              Editar Perfil
            </button>
          )}
        </div>

        <div className="profile-info">
          <div className="info-section">
            <h2>Información Personal</h2>
            
            <div className="info-row">
              <label>Nombre</label>
              {isEditing ? (
                <input
                  type="text"
                  name="nombre"
                  value={userData.nombre}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData.nombre}</span>
              )}
            </div>

            <div className="info-row">
              <label>Apellido</label>
              {isEditing ? (
                <input
                  type="text"
                  name="apellido"
                  value={userData.apellido}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData.apellido}</span>
              )}
            </div>

            <div className="info-row">
              <label>Correo Electrónico</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData.email}</span>
              )}
            </div>

            <div className="info-row">
              <label>Teléfono</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="telefono"
                  value={userData.telefono}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData.telefono}</span>
              )}
            </div>

            <div className="info-row">
              <label>Fecha de Nacimiento</label>
              {isEditing ? (
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={userData.fechaNacimiento}
                  onChange={handleChange}
                />
              ) : (
                <span>{new Date(userData.fechaNacimiento).toLocaleDateString('es-ES')}</span>
              )}
            </div>
          </div>

          <div className="info-section">
            <h2>Información Académica</h2>
            
            <div className="info-row">
              <label>Carrera</label>
              {isEditing ? (
                <input
                  type="text"
                  name="carrera"
                  value={userData.carrera}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData.carrera}</span>
              )}
            </div>

            <div className="info-row">
              <label>Tipo de Usuario</label>
              {isEditing ? (
                <select
                  name="tipoUsuario"
                  value={userData.tipoUsuario}
                  onChange={handleChange}
                >
                  <option value="Estudiante">Estudiante</option>
                  <option value="Profesor">Profesor</option>
                  <option value="Emprendedor">Emprendedor</option>
                  <option value="Mentor">Mentor</option>
                </select>
              ) : (
                <span>{userData.tipoUsuario}</span>
              )}
            </div>

            <div className="info-row">
              <label>Miembro desde</label>
              <span>{new Date(userData.fechaRegistro).toLocaleDateString('es-ES')}</span>
            </div>
          </div>

          {isEditing && (
            <div className="action-buttons">
              <button className="save-button" onClick={handleSave}>
                Guardar Cambios
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="security-section">
          <h2>Seguridad</h2>
          <button className="change-password-button">
            Cambiar Contraseña
          </button>
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

export default Profile;