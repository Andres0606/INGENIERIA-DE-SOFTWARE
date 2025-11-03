import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Components/Profile.css';
import Header from '../Header-footer/Header.jsx';
import Footer from '../Header-footer/Footer.jsx';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    idcarrera: '',
    idtipousuario: '',
    fecharegistro: '',
    tipodocumento: '',
    numdocumento: ''
  });
  
  const [carreras, setCarreras] = useState([]);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Cargar datos del usuario desde sessionStorage
  useEffect(() => {
    const loadUserData = () => {
      const storedUserData = sessionStorage.getItem('userData');
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        setUserData({
          ...user,
          // Asegurar que los campos opcionales tengan valores por defecto
          telefono: user.telefono || '',
          tipodocumento: user.tipodocumento || '',
          numdocumento: user.numdocumento || ''
        });
      }
      setLoading(false);
    };

    loadUserData();
    loadCarreras();
    loadTiposUsuario();
  }, []);

  // Cargar carreras desde el backend
  const loadCarreras = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/usuarios/carreras');
      const data = await response.json();
      if (data.success) {
        setCarreras(data.data);
      }
    } catch (error) {
      console.error('Error cargando carreras:', error);
    }
  };

  // Cargar tipos de usuario desde el backend
  const loadTiposUsuario = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/usuarios/tipos-usuario');
      const data = await response.json();
      if (data.success) {
        setTiposUsuario(data.data);
      }
    } catch (error) {
      console.error('Error cargando tipos de usuario:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Preparar datos para enviar (solo campos editables)
      const updateData = {
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        telefono: userData.telefono,
        idcarrera: userData.idcarrera ? parseInt(userData.idcarrera) : null,
        tipodocumento: userData.tipodocumento || null,
        numdocumento: userData.numdocumento || null
      };

      console.log('Actualizando datos:', updateData);

      // Aquí deberías hacer la llamada a tu API para actualizar el usuario
      // Por ahora solo simulamos la actualización
      
      // Actualizar sessionStorage con los nuevos datos
      const updatedUserData = {
        ...JSON.parse(sessionStorage.getItem('userData')),
        ...updateData
      };
      sessionStorage.setItem('userData', JSON.stringify(updatedUserData));

      setIsEditing(false);
      setMessage('Perfil actualizado correctamente');
      
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Error actualizando perfil:', error);
      setMessage('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Recargar datos originales
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    setIsEditing(false);
    setMessage('');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleChangePassword = () => {
    // Aquí puedes implementar el cambio de contraseña
    alert('Funcionalidad de cambio de contraseña en desarrollo');
  };

  // Obtener nombre de la carrera
  const getCarreraNombre = () => {
    const carrera = carreras.find(c => c.idcarrera === parseInt(userData.idcarrera));
    return carrera ? carrera.nombre : 'No especificada';
  };

  // Obtener nombre del tipo de usuario
  const getTipoUsuarioNombre = () => {
    const tipo = tiposUsuario.find(t => t.idtipousuario === parseInt(userData.idtipousuario));
    return tipo ? tipo.nombre : 'No especificado';
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="profile-container">
          <div className="profile-card">
            <div className="loading">Cargando perfil...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <button className="back-button" onClick={handleBack}>
            ← Volver al menú
          </button>

          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {userData.nombres?.charAt(0)}{userData.apellidos?.charAt(0)}
              </div>
            </div>
            <div className="profile-title">
              <h1>{userData.nombres} {userData.apellidos}</h1>
              <p className="profile-role">{getTipoUsuarioNombre()}</p>
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
                    name="nombres"
                    value={userData.nombres}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{userData.nombres}</span>
                )}
              </div>

              <div className="info-row">
                <label>Apellido</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="apellidos"
                    value={userData.apellidos}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{userData.apellidos}</span>
                )}
              </div>

              <div className="info-row">
                <label>Correo Electrónico</label>
                <span className="readonly-field">{userData.correo}</span>
              </div>

              <div className="info-row">
                <label>Teléfono</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="telefono"
                    value={userData.telefono}
                    onChange={handleChange}
                    placeholder="3001234567"
                  />
                ) : (
                  <span>{userData.telefono || 'No especificado'}</span>
                )}
              </div>

              <div className="info-row">
                <label>Tipo de Documento</label>
                {isEditing ? (
                  <select
                    name="tipodocumento"
                    value={userData.tipodocumento}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="PA">Pasaporte</option>
                  </select>
                ) : (
                  <span>{userData.tipodocumento || 'No especificado'}</span>
                )}
              </div>

              <div className="info-row">
                <label>Número de Documento</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="numdocumento"
                    value={userData.numdocumento}
                    onChange={handleChange}
                    placeholder="123456789"
                  />
                ) : (
                  <span>{userData.numdocumento || 'No especificado'}</span>
                )}
              </div>
            </div>

            <div className="info-section">
              <h2>Información Académica</h2>
              
              <div className="info-row">
                <label>Carrera</label>
                {isEditing ? (
                  <select
                    name="idcarrera"
                    value={userData.idcarrera}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona tu carrera</option>
                    {carreras.map(carrera => (
                      <option key={carrera.idcarrera} value={carrera.idcarrera}>
                        {carrera.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{getCarreraNombre()}</span>
                )}
              </div>

              <div className="info-row">
                <label>Tipo de Usuario</label>
                <span className="readonly-field">{getTipoUsuarioNombre()}</span>
              </div>

              <div className="info-row">
                <label>Miembro desde</label>
                <span>
                  {userData.fecharegistro 
                    ? new Date(userData.fecharegistro).toLocaleDateString('es-ES')
                    : 'Fecha no disponible'
                  }
                </span>
              </div>
            </div>

            {isEditing && (
              <div className="action-buttons">
                <button 
                  className="save-button" 
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="security-section">
            <h2>Seguridad</h2>
            <button className="change-password-button" onClick={handleChangePassword}>
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;