import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Components/Profile.css';
import Header from '../Header-footer/Header.jsx';
import Footer from '../Header-footer/Footer.jsx';
import HistorialComprasSection from './HistorialComprasSection.jsx';
import HistorialVentasSection from './HistorialVentasSection.jsx';
import FavoritosSection from './FavoritosSection.jsx';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showRecargaModal, setShowRecargaModal] = useState(false);
  const [montoRecarga, setMontoRecarga] = useState('');
  const [recargando, setRecargando] = useState(false);
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
    numdocumento: '',
    saldo: 0
  });
  
  const [originalData, setOriginalData] = useState({});
  const [carreras, setCarreras] = useState([]);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [activeSection, setActiveSection] = useState('perfil');
  const navigate = useNavigate();

  // Función para cargar datos del usuario CON VALIDACIONES
  const loadUserData = () => {
    try {
      const storedUserData = sessionStorage.getItem('userData');
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        console.log('📋 Datos del usuario en sessionStorage:', user);
        
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
          numdocumento: user.numdocumento || '',
          saldo: user.saldo || 0
        };
        
        setUserData(userDataFormatted);
        setOriginalData(userDataFormatted);
      }
    } catch (error) {
      console.error('❌ Error cargando datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar saldo desde sessionStorage
  const actualizarSaldoDesdeStorage = () => {
    try {
      const storedUserData = sessionStorage.getItem('userData');
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        setUserData(prev => ({
          ...prev,
          saldo: user.saldo || 0
        }));
        console.log('✅ Saldo actualizado en Profile:', user.saldo);
      }
    } catch (error) {
      console.error('❌ Error actualizando saldo:', error);
    }
  };

  // Cargar datos del usuario desde sessionStorage Y escuchar cambios
  useEffect(() => {
    loadUserData();
    loadCarreras();
    loadTiposUsuario();

    // 👇 ESCUCHAR CAMBIOS EN EL SESSION STORAGE
    const handleStorageChange = () => {
      console.log('🔄 SessionStorage cambió, actualizando Profile...');
      loadUserData();
    };

    // Escuchar cambios en sessionStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Escuchar evento personalizado de actualización de saldo
    const handleUserDataUpdated = () => {
      console.log('🔄 UserData actualizado, sincronizando Profile...');
      actualizarSaldoDesdeStorage();
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdated);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleUserDataUpdated);
    };
  }, []);

  // Actualizar saldo cuando se cambia de sección
  useEffect(() => {
    actualizarSaldoDesdeStorage();
  }, [activeSection]);

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
      if (!userData.nombres?.trim() || !userData.apellidos?.trim()) {
        setMessage('Nombre y apellido son obligatorios');
        setMessageType('error');
        return;
      }

      // Preparar datos para enviar al backend
      const updateData = {
        idusuario: userData.idusuario,
        nombres: userData.nombres.trim(),
        apellidos: userData.apellidos.trim(),
        telefono: userData.telefono?.trim() || null,
        idcarrera: userData.idcarrera ? parseInt(userData.idcarrera) : null,
        tipodocumento: userData.tipodocumento?.trim() || null,
        numdocumento: userData.numdocumento?.trim() || null
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
          ...JSON.parse(sessionStorage.getItem('userData') || '{}'),
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
    alert('Funcionalidad de cambio de contraseña en desarrollo');
  };

  // Función para recargar saldo
  const handleRecargarSaldo = async () => {
    if (!montoRecarga || montoRecarga <= 0) {
      setMessage('Ingresa un monto válido');
      setMessageType('error');
      return;
    }

    try {
      setRecargando(true);
      setMessage('');

      const response = await fetch('http://localhost:3000/api/transacciones/recargar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idusuario: userData.idusuario,
          monto: parseFloat(montoRecarga)
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar saldo en el estado local
        setUserData(prev => ({
          ...prev,
          saldo: data.data.saldo
        }));

        // Actualizar sessionStorage
        const updatedUserData = {
          ...JSON.parse(sessionStorage.getItem('userData') || '{}'),
          saldo: data.data.saldo
        };
        sessionStorage.setItem('userData', JSON.stringify(updatedUserData));

        // Notificar a otros componentes
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('userDataUpdated'));

        setMessage(`✅ ${data.message}`);
        setMessageType('success');
        setShowRecargaModal(false);
        setMontoRecarga('');
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error recargando saldo:', error);
      setMessage(`❌ ${error.message}`);
      setMessageType('error');
    } finally {
      setRecargando(false);
    }
  };

  // Obtener nombre de la carrera CON VALIDACIÓN
  const getCarreraNombre = () => {
    if (!userData.idcarrera) return 'No especificada';
    const carrera = carreras.find(c => c.idcarrera === parseInt(userData.idcarrera));
    return carrera ? carrera.nombre : 'No especificada';
  };

  // Obtener nombre del tipo de usuario CON VALIDACIÓN
  const getTipoUsuarioNombre = () => {
    if (!userData.idtipousuario) return 'No especificado';
    const tipo = tiposUsuario.find(t => t.idtipousuario === parseInt(userData.idtipousuario));
    return tipo ? tipo.nombre : 'No especificado';
  };

  // Formatear fecha CON VALIDACIÓN ROBUSTA
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Fecha no disponible';
      }
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha no disponible';
    }
  };

  // Formatear saldo
  const formatSaldo = (saldo) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(saldo || 0);
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
                {(userData.nombres?.charAt(0) || '')}{(userData.apellidos?.charAt(0) || '')}
              </div>
            </div>
            <div className="profile-title">
              <h1>{userData.nombres || ''} {userData.apellidos || ''}</h1>
              <p className="profile-role">{getTipoUsuarioNombre()}</p>
              <p className="profile-email">{userData.correo || ''}</p>
              <div className="profile-saldo">
                <strong>Saldo disponible:</strong> {formatSaldo(userData.saldo)}
                <button 
                  onClick={actualizarSaldoDesdeStorage}
                  title="Actualizar saldo"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    marginLeft: '10px',
                    fontSize: '0.8em'
                  }}
                >
                  🔄
                </button>
              </div>
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
              className={`nav-btn ${activeSection === 'compras' ? 'active' : ''}`}
              onClick={() => setActiveSection('compras')}
            >
              🛒 Mis Compras
            </button>
            
            {userData.idtipousuario === 2 && (
              <button 
                className={`nav-btn ${activeSection === 'ventas' ? 'active' : ''}`}
                onClick={() => setActiveSection('ventas')}
              >
                💰 Mis Ventas
              </button>
            )}
            
            <button 
              className={`nav-btn ${activeSection === 'favoritos' ? 'active' : ''}`}
              onClick={() => setActiveSection('favoritos')}
            >
              ❤️ Mis Favoritos
            </button>
          </div>

          {/* Sección de Información Personal */}
          {activeSection === 'perfil' && (
            <PerfilSection 
              userData={userData}
              isEditing={isEditing}
              carreras={carreras}
              handleChange={handleChange}
              handleSave={handleSave}
              handleCancel={handleCancel}
              saving={saving}
              getCarreraNombre={getCarreraNombre}
              getTipoUsuarioNombre={getTipoUsuarioNombre}
              formatDate={formatDate}
              formatSaldo={formatSaldo}
              setShowRecargaModal={setShowRecargaModal}
              actualizarSaldoDesdeStorage={actualizarSaldoDesdeStorage}
            />
          )}

          {/* Sección de Compras */}
          {activeSection === 'compras' && (
            <HistorialComprasSection userId={userData.idusuario} />
          )}

          {/* Sección de Ventas */}
          {activeSection === 'ventas' && userData.idtipousuario === 2 && (
            <HistorialVentasSection userId={userData.idusuario} />
          )}

          {/* Sección de Favoritos */}
          {activeSection === 'favoritos' && (
            <FavoritosSection userId={userData.idusuario} />
          )}

          {/* Sección de Seguridad */}
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

      {/* Modal de Recarga de Saldo */}
      {showRecargaModal && (
        <RecargaModal 
          userData={userData}
          montoRecarga={montoRecarga}
          setMontoRecarga={setMontoRecarga}
          recargando={recargando}
          handleRecargarSaldo={handleRecargarSaldo}
          setShowRecargaModal={setShowRecargaModal}
          formatSaldo={formatSaldo}
        />
      )}

      <Footer />
    </>
  );
};

// Componente para la sección de perfil CON VALIDACIONES
const PerfilSection = ({ 
  userData, 
  isEditing, 
  carreras, 
  handleChange, 
  handleSave, 
  handleCancel, 
  saving, 
  getCarreraNombre, 
  getTipoUsuarioNombre, 
  formatDate, 
  formatSaldo,
  setShowRecargaModal,
  actualizarSaldoDesdeStorage 
}) => {
  return (
    <div className="profile-info">
      <div className="info-section">
        <h2>Información Personal</h2>
        
        <div className="info-row">
          <label>Nombre *</label>
          {isEditing ? (
            <input
              type="text"
              name="nombres"
              value={userData.nombres || ''}
              onChange={handleChange}
              required
            />
          ) : (
            <span>{userData.nombres || 'No especificado'}</span>
          )}
        </div>

        <div className="info-row">
          <label>Apellido *</label>
          {isEditing ? (
            <input
              type="text"
              name="apellidos"
              value={userData.apellidos || ''}
              onChange={handleChange}
              required
            />
          ) : (
            <span>{userData.apellidos || 'No especificado'}</span>
          )}
        </div>

        <div className="info-row">
          <label>Correo Electrónico</label>
          <span className="readonly-field">{userData.correo || 'No especificado'}</span>
        </div>

        <div className="info-row">
          <label>Saldo Disponible</label>
          <div className="saldo-section">
            <span className="saldo-amount">
              {formatSaldo(userData.saldo)}
            </span>
            <div className="saldo-buttons">
              <button 
                className="btn-recargar"
                onClick={() => setShowRecargaModal(true)}
                type="button"
              >
                💰 Recargar Saldo
              </button>
              <button 
                className="btn-actualizar-saldo"
                onClick={actualizarSaldoDesdeStorage}
                type="button"
                title="Actualizar saldo"
              >
                🔄
              </button>
            </div>
          </div>
        </div>

        <div className="info-row">
          <label>Teléfono</label>
          {isEditing ? (
            <input
              type="tel"
              name="telefono"
              value={userData.telefono || ''}
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
              value={userData.tipodocumento || ''}
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
              value={userData.numdocumento || ''}
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
              value={userData.idcarrera || ''}
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
  );
};

// Componente para el modal de recarga
const RecargaModal = ({ 
  userData, 
  montoRecarga, 
  setMontoRecarga, 
  recargando, 
  handleRecargarSaldo, 
  setShowRecargaModal, 
  formatSaldo 
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Recargar Saldo</h3>
          <button 
            className="close-button"
            onClick={() => {
              setShowRecargaModal(false);
              setMontoRecarga('');
            }}
            disabled={recargando}
          >
            ×
          </button>
        </div>
        
        <div className="modal-content">
          <div className="saldo-actual">
            <strong>Saldo actual:</strong> {formatSaldo(userData.saldo)}
          </div>
          
          <div className="form-group">
            <label>Monto a recargar *</label>
            <input
              type="number"
              value={montoRecarga}
              onChange={(e) => setMontoRecarga(e.target.value)}
              min="1"
              step="1000"
              placeholder="Ej: 50000"
              className="monto-input"
              disabled={recargando}
            />
            <small>Mínimo: $1.000</small>
          </div>

          <div className="suggested-amounts">
            <p>Montos sugeridos:</p>
            <div className="amount-buttons">
              {[10000, 20000, 50000, 100000].map(monto => (
                <button
                  key={monto}
                  type="button"
                  className="amount-btn"
                  onClick={() => setMontoRecarga(monto)}
                  disabled={recargando}
                >
                  ${monto.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button 
            className="btn-primary"
            onClick={handleRecargarSaldo}
            disabled={recargando || !montoRecarga || montoRecarga < 1000}
          >
            {recargando ? 'Procesando...' : `Recargar ${formatSaldo(montoRecarga)}`}
          </button>
          <button 
            className="btn-secondary"
            onClick={() => {
              setShowRecargaModal(false);
              setMontoRecarga('');
            }}
            disabled={recargando}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;