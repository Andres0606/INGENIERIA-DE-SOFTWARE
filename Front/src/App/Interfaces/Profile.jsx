import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Components/Profile.css';
import Header from '../Header-footer/Header.jsx';
import Footer from '../Header-footer/Footer.jsx';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    idusuario: '',
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
  
  const [originalData, setOriginalData] = useState({});
  const [carreras, setCarreras] = useState([]);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [activeSection, setActiveSection] = useState('perfil'); // 'perfil' o 'favoritos'
  const navigate = useNavigate();

  const userDataStored = JSON.parse(sessionStorage.getItem('userData') || '{}');

  // Cargar datos del usuario desde sessionStorage
  useEffect(() => {
    const loadUserData = () => {
      const storedUserData = sessionStorage.getItem('userData');
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        const userDataFormatted = {
          idusuario: user.idusuario || '',
          nombres: user.nombres || '',
          apellidos: user.apellidos || '',
          correo: user.correo || '',
          telefono: user.telefono || '',
          idcarrera: user.idcarrera || '',
          idtipousuario: user.idtipousuario || '',
          fecharegistro: user.fecharegistro || '',
          tipodocumento: user.tipodocumento || '',
          numdocumento: user.numdocumento || ''
        };
        
        setUserData(userDataFormatted);
        setOriginalData(userDataFormatted);
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
      setSaving(true);
      setMessage('');
      setMessageType('');
      
      // Validaciones básicas
      if (!userData.nombres.trim() || !userData.apellidos.trim()) {
        setMessage('Nombre y apellido son obligatorios');
        setMessageType('error');
        return;
      }

      // Preparar datos para enviar al backend
      const updateData = {
        idusuario: userData.idusuario,
        nombres: userData.nombres.trim(),
        apellidos: userData.apellidos.trim(),
        telefono: userData.telefono.trim() || null,
        idcarrera: userData.idcarrera ? parseInt(userData.idcarrera) : null,
        tipodocumento: userData.tipodocumento.trim() || null,
        numdocumento: userData.numdocumento.trim() || null
      };

      console.log('Enviando datos de actualización:', updateData);

      // LLAMADA AL BACKEND PARA ACTUALIZAR PERFIL
      const response = await fetch(`http://localhost:3000/api/usuarios/actualizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      console.log('Respuesta del backend:', data);

      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      if (data.success) {
        // Actualizar sessionStorage con los nuevos datos
        const updatedUserData = {
          ...JSON.parse(sessionStorage.getItem('userData')),
          ...updateData
        };
        sessionStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Actualizar estado original
        setOriginalData(updatedUserData);

        setIsEditing(false);
        setMessage('Perfil actualizado correctamente');
        setMessageType('success');
        
        // Recargar la página después de 2 segundos para actualizar el header
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
      } else {
        throw new Error(data.message || 'Error al actualizar el perfil');
      }

    } catch (error) {
      console.error('Error actualizando perfil:', error);
      setMessage(error.message || 'Error al actualizar el perfil');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Restaurar datos originales
    setUserData(originalData);
    setIsEditing(false);
    setMessage('');
    setMessageType('');
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
    if (!userData.idcarrera) return 'No especificada';
    const carrera = carreras.find(c => c.idcarrera === parseInt(userData.idcarrera));
    return carrera ? carrera.nombre : 'No especificada';
  };

  // Obtener nombre del tipo de usuario
  const getTipoUsuarioNombre = () => {
    if (!userData.idtipousuario) return 'No especificado';
    const tipo = tiposUsuario.find(t => t.idtipousuario === parseInt(userData.idtipousuario));
    return tipo ? tipo.nombre : 'No especificado';
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
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
            <div className={`message ${messageType}`}>
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
              <p className="profile-email">{userData.correo}</p>
            </div>
            {!isEditing && activeSection === 'perfil' && (
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                Editar Perfil
              </button>
            )}
          </div>

          {/* Navegación entre secciones */}
          <div className="profile-navigation">
            <button 
              className={`nav-btn ${activeSection === 'perfil' ? 'active' : ''}`}
              onClick={() => setActiveSection('perfil')}
            >
              👤 Información Personal
            </button>
            <button 
              className={`nav-btn ${activeSection === 'favoritos' ? 'active' : ''}`}
              onClick={() => setActiveSection('favoritos')}
            >
              ❤️ Mis Favoritos
            </button>
          </div>

          {/* Sección de Información Personal */}
          {activeSection === 'perfil' && (
            <div className="profile-info">
              <div className="info-section">
                <h2>Información Personal</h2>
                
                <div className="info-row">
                  <label>Nombre *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nombres"
                      value={userData.nombres}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <span>{userData.nombres}</span>
                  )}
                </div>

                <div className="info-row">
                  <label>Apellido *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="apellidos"
                      value={userData.apellidos}
                      onChange={handleChange}
                      required
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
                  <span>{formatDate(userData.fecharegistro)}</span>
                </div>
              </div>

              {isEditing && (
                <div className="action-buttons">
                  <button 
                    className="save-button" 
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button 
                    className="cancel-button" 
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sección de Favoritos */}
          {activeSection === 'favoritos' && (
            <FavoritosSection userId={userData.idusuario} />
          )}

          {/* Sección de Seguridad (solo en perfil) */}
          {activeSection === 'perfil' && (
            <div className="security-section">
              <h2>Seguridad</h2>
              <button className="change-password-button" onClick={handleChangePassword}>
                Cambiar Contraseña
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

// Componente para la sección de favoritos
const FavoritosSection = ({ userId }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchFavoritos();
    }
  }, [userId]);

  const fetchFavoritos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/favoritos/usuario/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setFavoritos(data.data);
      } else {
        throw new Error(data.message || 'Error al cargar favoritos');
      }
    } catch (err) {
      console.error('Error cargando favoritos:', err);
      setError('Error al cargar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const eliminarFavorito = async (idproducto) => {
    try {
      const response = await fetch('http://localhost:3000/api/favoritos/eliminar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idusuario: userId,
          idproducto: idproducto
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Actualizar lista local
        setFavoritos(prev => prev.filter(fav => fav.idproducto !== idproducto));
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error eliminando favorito:', err);
      alert('Error al eliminar favorito: ' + err.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="favoritos-section">
        <h2>Mis Productos Favoritos</h2>
        <div className="loading-favoritos">Cargando favoritos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favoritos-section">
        <h2>Mis Productos Favoritos</h2>
        <div className="error-favoritos">
          <p>{error}</p>
          <button onClick={fetchFavoritos} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="favoritos-section">
      <h2>Mis Productos Favoritos ({favoritos.length})</h2>
      
      {favoritos.length === 0 ? (
        <div className="empty-favoritos">
          <div className="empty-icon">❤️</div>
          <h3>No tienes productos favoritos</h3>
          <p>Explora el marketplace y agrega productos que te gusten</p>
          <button 
            className="btn-explorar"
            onClick={() => window.location.href = '/productos'}
          >
            Explorar Productos
          </button>
        </div>
      ) : (
        <div className="favoritos-grid">
          {favoritos.map((favorito) => (
            <div key={favorito.idfavoritoproducto} className="favorito-card">
              <div className="favorito-header">
                <h3>{favorito.producto.nombre}</h3>
                <button 
                  className="btn-eliminar-favorito"
                  onClick={() => eliminarFavorito(favorito.idproducto)}
                  title="Eliminar de favoritos"
                >
                  ❌
                </button>
              </div>
              
              <p className="favorito-descripcion">
                {favorito.producto.descripcion || 'Sin descripción'}
              </p>
              
              <div className="favorito-info">
                <div className="favorito-precio">
                  {formatPrice(favorito.producto.precio)}
                </div>
                <div className="favorito-emprendimiento">
                  <strong>Emprendimiento:</strong> {favorito.producto.emprendimiento.nombre}
                </div>
                <div className="favorito-categoria">
                  <strong>Categoría:</strong> {favorito.producto.emprendimiento.categoria.nombre}
                </div>
                <div className="favorito-emprendedor">
                  <strong>Emprendedor:</strong> {favorito.producto.emprendimiento.usuario.nombres} {favorito.producto.emprendimiento.usuario.apellidos}
                </div>
              </div>
              
              <div className="favorito-actions">
                <button className="btn-contactar">
                  📧 Contactar
                </button>
                <button className="btn-comprar">
                  🛒 Comprar
                </button>
              </div>
              
              <div className="favorito-fecha">
                Agregado el: {new Date(favorito.fechamarcado).toLocaleDateString('es-ES')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;