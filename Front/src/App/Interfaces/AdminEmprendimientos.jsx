import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Components/AdminEmprendimientos.css';
import Header from '../Header-footer/Header.jsx';
import Footer from '../Header-footer/Footer.jsx';

const AdminEmprendimientos = () => {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pendientes');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmprendimiento, setSelectedEmprendimiento] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const navigate = useNavigate();

  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

  // Verificar si es administrador
  useEffect(() => {
    if (!userData.idusuario || userData.idtipousuario !== 1) {
      navigate('/');
      return;
    }
    
    loadEmprendimientos();
    loadCategorias();
  }, [userData.idusuario]);

  // Cargar todos los emprendimientos
  const loadEmprendimientos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/emprendimientos');
      const data = await response.json();
      
      if (data.success) {
        setEmprendimientos(data.data);
      } else {
        setMessage('Error al cargar emprendimientos');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error cargando emprendimientos:', error);
      setMessage('Error de conexión');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías
  const loadCategorias = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/categorias');
      const data = await response.json();
      if (data.success) {
        setCategorias(data.data);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  // Filtrar emprendimientos por estado
  const getEmprendimientosFiltrados = () => {
    switch (activeTab) {
      case 'pendientes':
        return emprendimientos.filter(e => e.estado === 'pendiente');
      case 'aprobados':
        return emprendimientos.filter(e => e.estado === 'aprobado');
      case 'rechazados':
        return emprendimientos.filter(e => e.estado === 'rechazado');
      default:
        return emprendimientos;
    }
  };

  // Aprobar emprendimiento
  const handleAprobar = async (idemprendimiento) => {
    try {
      const response = await fetch(`http://localhost:3000/api/emprendimientos/${idemprendimiento}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: 'aprobado',
          motivo: null
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Emprendimiento aprobado exitosamente');
        setMessageType('success');
        loadEmprendimientos(); // Recargar lista
      } else {
        throw new Error(data.message || 'Error al aprobar emprendimiento');
      }
    } catch (error) {
      console.error('Error aprobando emprendimiento:', error);
      setMessage(error.message || 'Error al aprobar emprendimiento');
      setMessageType('error');
    }
  };

  // Abrir modal de rechazo
  const openRechazoModal = (emprendimiento) => {
    setSelectedEmprendimiento(emprendimiento);
    setMotivoRechazo('');
    setShowModal(true);
  };

  // Rechazar emprendimiento
  const handleRechazar = async () => {
    if (!motivoRechazo.trim()) {
      setMessage('Debe ingresar un motivo de rechazo');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/emprendimientos/${selectedEmprendimiento.idemprendimiento}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: 'rechazado',
          motivo: motivoRechazo.trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Emprendimiento rechazado exitosamente');
        setMessageType('success');
        setShowModal(false);
        loadEmprendimientos(); // Recargar lista
      } else {
        throw new Error(data.message || 'Error al rechazar emprendimiento');
      }
    } catch (error) {
      console.error('Error rechazando emprendimiento:', error);
      setMessage(error.message || 'Error al rechazar emprendimiento');
      setMessageType('error');
    }
  };

  // Obtener nombre de categoría
  const getCategoriaNombre = (idcategoria) => {
    const categoria = categorias.find(c => c.idcategoria === idcategoria);
    return categoria ? categoria.nombre : 'Sin categoría';
  };

  // Obtener estadísticas
  const getStats = () => {
    return {
      pendientes: emprendimientos.filter(e => e.estado === 'pendiente').length,
      aprobados: emprendimientos.filter(e => e.estado === 'aprobado').length,
      rechazados: emprendimientos.filter(e => e.estado === 'rechazado').length,
      total: emprendimientos.length
    };
  };

  const stats = getStats();
  const emprendimientosFiltrados = getEmprendimientosFiltrados();

  if (loading) {
    return (
      <>
        <Header />
        <div className="admin-emprendimientos-container">
          <div className="loading">Cargando emprendimientos...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="admin-emprendimientos-container">
        <div className="admin-emprendimientos-content">
          {/* Header */}
          <div className="admin-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              ← Volver
            </button>
            <h1>Gestión de Emprendimientos</h1>
            <p>Administra los emprendimientos de la plataforma</p>
          </div>

          {/* Mensajes */}
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          {/* Estadísticas */}
          <div className="stats-grid">
            <div className="stat-card pendientes">
              <h3>{stats.pendientes}</h3>
              <p>Pendientes</p>
            </div>
            <div className="stat-card aprobados">
              <h3>{stats.aprobados}</h3>
              <p>Aprobados</p>
            </div>
            <div className="stat-card rechazados">
              <h3>{stats.rechazados}</h3>
              <p>Rechazados</p>
            </div>
            <div className="stat-card total">
              <h3>{stats.total}</h3>
              <p>Total</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'pendientes' ? 'active' : ''}`}
              onClick={() => setActiveTab('pendientes')}
            >
              Pendientes ({stats.pendientes})
            </button>
            <button 
              className={`tab ${activeTab === 'aprobados' ? 'active' : ''}`}
              onClick={() => setActiveTab('aprobados')}
            >
              Aprobados ({stats.aprobados})
            </button>
            <button 
              className={`tab ${activeTab === 'rechazados' ? 'active' : ''}`}
              onClick={() => setActiveTab('rechazados')}
            >
              Rechazados ({stats.rechazados})
            </button>
          </div>

          {/* Lista de Emprendimientos */}
          <div className="emprendimientos-list">
            {emprendimientosFiltrados.length === 0 ? (
              <div className="empty-state">
                <h3>No hay emprendimientos {activeTab}</h3>
                <p>No se encontraron emprendimientos en este estado</p>
              </div>
            ) : (
              emprendimientosFiltrados.map(emprendimiento => (
                <div key={emprendimiento.idemprendimiento} className="emprendimiento-card">
                  <div className="emprendimiento-header">
                    <div className="emprendimiento-info">
                      <h3>{emprendimiento.nombre}</h3>
                      <p className="descripcion">{emprendimiento.descripcion}</p>
                      <div className="emprendimiento-meta">
                        <span className="categoria">
                          {getCategoriaNombre(emprendimiento.idcategoria)}
                        </span>
                        <span className={`estado ${emprendimiento.estado}`}>
                          {emprendimiento.estado}
                        </span>
                        <span className="fecha">
                          Creado: {new Date(emprendimiento.fecharegistro).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Información del Emprendedor */}
                    <div className="emprendedor-info">
                      <h4>Emprendedor</h4>
                      <p>
                        {emprendimiento.usuario?.nombres} {emprendimiento.usuario?.apellidos}
                      </p>
                      <p className="email">{emprendimiento.usuario?.correo}</p>
                    </div>
                  </div>

                  {/* Acciones según estado */}
                  <div className="emprendimiento-actions">
                    {emprendimiento.estado === 'pendiente' && (
                      <>
                        <button 
                          className="btn-aprobar"
                          onClick={() => handleAprobar(emprendimiento.idemprendimiento)}
                        >
                          ✅ Aprobar
                        </button>
                        <button 
                          className="btn-rechazar"
                          onClick={() => openRechazoModal(emprendimiento)}
                        >
                          ❌ Rechazar
                        </button>
                      </>
                    )}
                    
                    {emprendimiento.estado === 'aprobado' && (
                      <span className="badge-success">Aprobado</span>
                    )}
                    
                    {emprendimiento.estado === 'rechazado' && (
                      <span className="badge-error">Rechazado</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Rechazo */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Rechazar Emprendimiento</h3>
              <button 
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>
                Estás a punto de rechazar el emprendimiento: 
                <strong> "{selectedEmprendimiento?.nombre}"</strong>
              </p>
              <p>Por favor, ingresa el motivo del rechazo:</p>
              
              <div className="form-group">
                <textarea
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  placeholder="Motivo del rechazo..."
                  rows="4"
                  required
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-confirm-rechazo"
                onClick={handleRechazar}
              >
                Confirmar Rechazo
              </button>
              <button 
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AdminEmprendimientos;