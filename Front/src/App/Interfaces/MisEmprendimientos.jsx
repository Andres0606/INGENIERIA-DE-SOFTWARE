import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Components/MisEmprendimientos.css';
import Header from '../Header-footer/Header.jsx';
import Footer from '../Header-footer/Footer.jsx';
import HistorialVentasSection from './HistorialVentasSection.jsx';

const MisEmprendimientos = () => {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [productos, setProductos] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedEmprendimiento, setSelectedEmprendimiento] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [editingStock, setEditingStock] = useState(null);
  const [nuevoStock, setNuevoStock] = useState('');
  const [activeTab, setActiveTab] = useState('emprendimientos');
  const [editingEmprendimiento, setEditingEmprendimiento] = useState(null);
  const [editingProducto, setEditingProducto] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  // Estados para formularios
  const [emprendimientoForm, setEmprendimientoForm] = useState({
    nombre: '',
    descripcion: '',
    idcategoria: ''
  });

  const [productoForm, setProductoForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: 0
  });

  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

  // Cargar datos iniciales
  useEffect(() => {
    if (!userData.idusuario) {
      navigate('/login');
      return;
    }
    
    loadEmprendimientos();
    loadCategorias();
  }, [userData.idusuario]);

  // Cargar emprendimientos del usuario
  const loadEmprendimientos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/emprendimientos/usuario/${userData.idusuario}`);
      const data = await response.json();
      
      if (data.success) {
        setEmprendimientos(data.data);
        // Cargar productos para cada emprendimiento
        data.data.forEach(emprendimiento => {
          loadProductos(emprendimiento.idemprendimiento);
        });
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

  // Cargar productos de un emprendimiento
  const loadProductos = async (idEmprendimiento) => {
    try {
      const response = await fetch(`http://localhost:3000/api/productos/emprendimiento/${idEmprendimiento}`);
      const data = await response.json();
      
      if (data.success) {
        setProductos(prev => ({
          ...prev,
          [idEmprendimiento]: data.data
        }));
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  // Manejar cambios en formularios
  const handleEmprendimientoChange = (e) => {
    const { name, value } = e.target;
    setEmprendimientoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductoChange = (e) => {
    const { name, value } = e.target;
    setProductoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Crear nuevo emprendimiento
  const handleCreateEmprendimiento = async (e) => {
    e.preventDefault();
    try {
      const emprendimientoData = {
        idusuario: userData.idusuario,
        idcategoria: parseInt(emprendimientoForm.idcategoria),
        nombre: emprendimientoForm.nombre,
        descripcion: emprendimientoForm.descripcion
      };

      const response = await fetch('http://localhost:3000/api/emprendimientos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emprendimientoData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Emprendimiento creado exitosamente');
        setMessageType('success');
        setShowCreateForm(false);
        setEmprendimientoForm({ nombre: '', descripcion: '', idcategoria: '' });
        loadEmprendimientos();
      } else {
        throw new Error(data.message || 'Error al crear emprendimiento');
      }
    } catch (error) {
      console.error('Error creando emprendimiento:', error);
      setMessage(error.message || 'Error al crear emprendimiento');
      setMessageType('error');
    }
  };

  // Editar emprendimiento
  const handleEditEmprendimiento = async (e) => {
    e.preventDefault();
    try {
      const emprendimientoData = {
        nombre: emprendimientoForm.nombre,
        descripcion: emprendimientoForm.descripcion,
        idcategoria: parseInt(emprendimientoForm.idcategoria)
      };

      const response = await fetch(`http://localhost:3000/api/emprendimientos/${editingEmprendimiento}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emprendimientoData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Emprendimiento actualizado exitosamente');
        setMessageType('success');
        setEditingEmprendimiento(null);
        setEmprendimientoForm({ nombre: '', descripcion: '', idcategoria: '' });
        loadEmprendimientos();
      } else {
        throw new Error(data.message || 'Error al actualizar emprendimiento');
      }
    } catch (error) {
      console.error('Error actualizando emprendimiento:', error);
      setMessage(error.message || 'Error al actualizar emprendimiento');
      setMessageType('error');
    }
  };

  // Eliminar emprendimiento
  const handleDeleteEmprendimiento = async (idEmprendimiento) => {
    try {
      const response = await fetch(`http://localhost:3000/api/emprendimientos/${idEmprendimiento}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Emprendimiento eliminado exitosamente');
        setMessageType('success');
        setShowDeleteConfirm(null);
        loadEmprendimientos();
      } else {
        throw new Error(data.message || 'Error al eliminar emprendimiento');
      }
    } catch (error) {
      console.error('Error eliminando emprendimiento:', error);
      setMessage(error.message || 'Error al eliminar emprendimiento');
      setMessageType('error');
    }
  };

  // Agregar producto a emprendimiento
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productoData = {
        idemprendimiento: selectedEmprendimiento,
        nombre: productoForm.nombre,
        descripcion: productoForm.descripcion,
        precio: parseFloat(productoForm.precio),
        stock: parseInt(productoForm.stock)
      };

      const response = await fetch('http://localhost:3000/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Producto agregado exitosamente');
        setMessageType('success');
        setShowProductForm(false);
        setProductoForm({ nombre: '', descripcion: '', precio: '', stock: 0 });
        loadProductos(selectedEmprendimiento);
      } else {
        throw new Error(data.message || 'Error al agregar producto');
      }
    } catch (error) {
      console.error('Error agregando producto:', error);
      setMessage(error.message || 'Error al agregar producto');
      setMessageType('error');
    }
  };

  // Editar producto
  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const productoData = {
        nombre: productoForm.nombre,
        descripcion: productoForm.descripcion,
        precio: parseFloat(productoForm.precio),
        stock: parseInt(productoForm.stock)
      };

      const response = await fetch(`http://localhost:3000/api/productos/${editingProducto}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Producto actualizado exitosamente');
        setMessageType('success');
        setEditingProducto(null);
        setProductoForm({ nombre: '', descripcion: '', precio: '', stock: 0 });
        loadProductos(selectedEmprendimiento);
      } else {
        throw new Error(data.message || 'Error al actualizar producto');
      }
    } catch (error) {
      console.error('Error actualizando producto:', error);
      setMessage(error.message || 'Error al actualizar producto');
      setMessageType('error');
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (idProducto, idEmprendimiento) => {
    try {
      const response = await fetch(`http://localhost:3000/api/productos/${idProducto}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Producto eliminado exitosamente');
        setMessageType('success');
        setShowDeleteConfirm(null);
        loadProductos(idEmprendimiento);
      } else {
        throw new Error(data.message || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error eliminando producto:', error);
      setMessage(error.message || 'Error al eliminar producto');
      setMessageType('error');
    }
  };

  // Función para actualizar stock
  const actualizarStock = async (idproducto, nuevoStock, idEmprendimiento) => {
    try {
      const response = await fetch(`http://localhost:3000/api/productos/${idproducto}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: parseInt(nuevoStock) }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Stock actualizado correctamente');
        setMessageType('success');
        setEditingStock(null);
        setNuevoStock('');
        loadProductos(idEmprendimiento);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error actualizando stock:', err);
      setMessage('Error al actualizar stock');
      setMessageType('error');
    }
  };

  // Abrir formulario para agregar producto
  const openProductForm = (idEmprendimiento) => {
    setSelectedEmprendimiento(idEmprendimiento);
    setShowProductForm(true);
    setEditingProducto(null);
    setProductoForm({ nombre: '', descripcion: '', precio: '', stock: 0 });
  };

  // Abrir formulario para editar emprendimiento
  const openEditEmprendimiento = (emprendimiento) => {
    setEditingEmprendimiento(emprendimiento.idemprendimiento);
    setEmprendimientoForm({
      nombre: emprendimiento.nombre,
      descripcion: emprendimiento.descripcion || '',
      idcategoria: emprendimiento.idcategoria
    });
  };

  // Abrir formulario para editar producto
  const openEditProduct = (producto, idEmprendimiento) => {
    setSelectedEmprendimiento(idEmprendimiento);
    setEditingProducto(producto.idproducto);
    setProductoForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock
    });
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditingEmprendimiento(null);
    setEditingProducto(null);
    setEmprendimientoForm({ nombre: '', descripcion: '', idcategoria: '' });
    setProductoForm({ nombre: '', descripcion: '', precio: '', stock: 0 });
  };

  // Obtener nombre de categoría
  const getCategoriaNombre = (idcategoria) => {
    const categoria = categorias.find(c => c.idcategoria === idcategoria);
    return categoria ? categoria.nombre : 'Sin categoría';
  };

  // Obtener estado del emprendimiento con estilo
  const getEstadoStyle = (estado) => {
    switch (estado) {
      case 'aprobado':
        return { background: '#e8f5e8', color: '#2e7d32', border: '1px solid #4caf50' };
      case 'pendiente':
        return { background: '#fff3e0', color: '#ef6c00', border: '1px solid #ff9800' };
      case 'rechazado':
        return { background: '#ffebee', color: '#c62828', border: '1px solid #f44336' };
      default:
        return { background: '#f5f5f5', color: '#666', border: '1px solid #ddd' };
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="mis-emprendimientos-container">
          <div className="loading">Cargando emprendimientos...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="mis-emprendimientos-container">
        <div className="mis-emprendimientos-content">
          {/* Header con pestañas */}
          <div className="emprendimientos-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              ← Volver
            </button>
            <h1>Mis Emprendimientos</h1>
            <p>Gestiona tus emprendimientos y productos</p>
            
            {/* Navegación por pestañas */}
            <div className="tabs-navigation">
              <button 
                className={`tab-btn ${activeTab === 'emprendimientos' ? 'active' : ''}`}
                onClick={() => setActiveTab('emprendimientos')}
              >
                🏪 Mis Emprendimientos
              </button>
              <button 
                className={`tab-btn ${activeTab === 'ventas' ? 'active' : ''}`}
                onClick={() => setActiveTab('ventas')}
              >
                💰 Historial de Ventas
              </button>
            </div>
          </div>

          {/* Mensajes */}
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          {/* Pestaña de Emprendimientos */}
          {activeTab === 'emprendimientos' && (
            <>
              {/* Botón Crear Emprendimiento */}
              <div className="create-section">
                <button 
                  className="btn-create-emprendimiento"
                  onClick={() => {
                    setShowCreateForm(true);
                    setEditingEmprendimiento(null);
                    setEmprendimientoForm({ nombre: '', descripcion: '', idcategoria: '' });
                  }}
                >
                  + Crear Nuevo Emprendimiento
                </button>
              </div>

              {/* Lista de Emprendimientos */}
              <div className="emprendimientos-list">
                {emprendimientos.length === 0 ? (
                  <div className="empty-state">
                    <h3>No tienes emprendimientos creados</h3>
                    <p>Crea tu primer emprendimiento para comenzar</p>
                  </div>
                ) : (
                  emprendimientos.map(emprendimiento => (
                    <div key={emprendimiento.idemprendimiento} className="emprendimiento-card">
                      <div className="emprendimiento-header">
                        <div className="emprendimiento-info">
                          <h3>{emprendimiento.nombre}</h3>
                          <p>{emprendimiento.descripcion}</p>
                          <div className="emprendimiento-meta">
                            <span className="categoria">
                              {getCategoriaNombre(emprendimiento.idcategoria)}
                            </span>
                            <span 
                              className="estado"
                              style={getEstadoStyle(emprendimiento.estado)}
                            >
                              {emprendimiento.estado}
                            </span>
                            <span className="fecha">
                              Creado: {new Date(emprendimiento.fecharegistro).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </div>
                        <div className="emprendimiento-actions">
  <button 
    className="btn-edit"
    onClick={() => openEditEmprendimiento(emprendimiento)}
    title="Editar emprendimiento"
  >
    ✏️ Editar
  </button>
  <button 
    className="btn-delete"
    onClick={() => setShowDeleteConfirm({
      type: 'emprendimiento',
      id: emprendimiento.idemprendimiento,
      nombre: emprendimiento.nombre
    })}
    title="Eliminar emprendimiento"
  >
    🗑️ Eliminar
  </button>
  <button 
    className="btn-add-product"
    onClick={() => openProductForm(emprendimiento.idemprendimiento)}
    disabled={emprendimiento.estado !== 'aprobado'}
    title={emprendimiento.estado !== 'aprobado' ? 'Solo se pueden agregar productos a emprendimientos aprobados' : 'Agregar producto'}
  >
    + Agregar Producto
  </button>
</div>
                      </div>

                      {/* Productos del Emprendimiento */}
                      <div className="productos-section">
                        <h4>Productos ({productos[emprendimiento.idemprendimiento]?.length || 0})</h4>
                        {productos[emprendimiento.idemprendimiento]?.length > 0 ? (
                          <div className="productos-grid">
                            {productos[emprendimiento.idemprendimiento].map(producto => (
                              <div key={producto.idproducto} className="producto-card">
                                <div className="producto-header">
                                  <h5>{producto.nombre}</h5>
                                  <div className="producto-actions">
                                    <button 
                                      className="btn-edit-small"
                                      onClick={() => openEditProduct(producto, emprendimiento.idemprendimiento)}
                                      title="Editar producto"
                                    >
                                      ✏️
                                    </button>
                                    <button 
                                      className="btn-delete-small"
                                      onClick={() => setShowDeleteConfirm({
                                        type: 'producto',
                                        id: producto.idproducto,
                                        nombre: producto.nombre,
                                        emprendimientoId: emprendimiento.idemprendimiento
                                      })}
                                      title="Eliminar producto"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                                <p>{producto.descripcion}</p>
                                <div className="producto-info">
                                  <div className="producto-precio">
                                    ${producto.precio.toLocaleString()}
                                  </div>
                                  
                                  {/* Gestión de Stock */}
                                  <div className="producto-stock">
                                    {editingStock === producto.idproducto ? (
                                      <div className="stock-editor">
                                        <input
                                          type="number"
                                          value={nuevoStock}
                                          onChange={(e) => setNuevoStock(e.target.value)}
                                          min="0"
                                          placeholder="Nuevo stock"
                                          className="stock-input"
                                        />
                                        <button 
                                          onClick={() => actualizarStock(producto.idproducto, nuevoStock, emprendimiento.idemprendimiento)}
                                          className="btn-stock-confirm"
                                        >
                                          ✅
                                        </button>
                                        <button 
                                          onClick={() => setEditingStock(null)}
                                          className="btn-stock-cancel"
                                        >
                                          ❌
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="stock-info">
                                        <span className={`stock-badge ${producto.stock === 0 ? 'agotado' : 'disponible'}`}>
                                          Stock: {producto.stock}
                                        </span>
                                        <button 
                                          onClick={() => {
                                            setEditingStock(producto.idproducto);
                                            setNuevoStock(producto.stock);
                                          }}
                                          className="btn-edit-stock"
                                          title="Editar stock"
                                        >
                                          ✏️
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="empty-products">
                            <p>No hay productos agregados</p>
                            {emprendimiento.estado === 'aprobado' && (
                              <button 
                                className="btn-add-product-small"
                                onClick={() => openProductForm(emprendimiento.idemprendimiento)}
                              >
                                + Agregar Primer Producto
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Pestaña de Historial de Ventas */}
          {activeTab === 'ventas' && (
            <HistorialVentasSection userId={userData.idusuario} />
          )}

          {/* Modal Crear/Editar Emprendimiento */}
          {(showCreateForm || editingEmprendimiento) && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>{editingEmprendimiento ? 'Editar Emprendimiento' : 'Crear Nuevo Emprendimiento'}</h3>
                  <button 
                    className="close-button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingEmprendimiento(null);
                      setEmprendimientoForm({ nombre: '', descripcion: '', idcategoria: '' });
                    }}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={editingEmprendimiento ? handleEditEmprendimiento : handleCreateEmprendimiento}>
                  <div className="form-group">
                    <label>Nombre del Emprendimiento *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={emprendimientoForm.nombre}
                      onChange={handleEmprendimientoChange}
                      required
                      placeholder="Ej: Mi Tienda Online"
                    />
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      name="descripcion"
                      value={emprendimientoForm.descripcion}
                      onChange={handleEmprendimientoChange}
                      placeholder="Describe tu emprendimiento..."
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Categoría *</label>
                    <select
                      name="idcategoria"
                      value={emprendimientoForm.idcategoria}
                      onChange={handleEmprendimientoChange}
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map(categoria => (
                        <option key={categoria.idcategoria} value={categoria.idcategoria}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      {editingEmprendimiento ? 'Actualizar Emprendimiento' : 'Crear Emprendimiento'}
                    </button>
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingEmprendimiento(null);
                        setEmprendimientoForm({ nombre: '', descripcion: '', idcategoria: '' });
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Agregar/Editar Producto */}
          {(showProductForm || editingProducto) && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>{editingProducto ? 'Editar Producto' : 'Agregar Producto'}</h3>
                  <button 
                    className="close-button"
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProducto(null);
                      setProductoForm({ nombre: '', descripcion: '', precio: '', stock: 0 });
                    }}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={editingProducto ? handleEditProduct : handleAddProduct}>
                  <div className="form-group">
                    <label>Nombre del Producto *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={productoForm.nombre}
                      onChange={handleProductoChange}
                      required
                      placeholder="Ej: Camiseta Básica"
                    />
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      name="descripcion"
                      value={productoForm.descripcion}
                      onChange={handleProductoChange}
                      placeholder="Describe tu producto..."
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Precio *</label>
                    <input
                      type="number"
                      name="precio"
                      value={productoForm.precio}
                      onChange={handleProductoChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Inicial</label>
                    <input
                      type="number"
                      name="stock"
                      value={productoForm.stock}
                      onChange={handleProductoChange}
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      {editingProducto ? 'Actualizar Producto' : 'Agregar Producto'}
                    </button>
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProducto(null);
                        setProductoForm({ nombre: '', descripcion: '', precio: '', stock: 0 });
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal de Confirmación de Eliminación */}
          {showDeleteConfirm && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Confirmar Eliminación</h3>
                  <button 
                    className="close-button"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    ×
                  </button>
                </div>
                <div className="delete-confirm">
                  <p>¿Estás seguro de que quieres eliminar <strong>"{showDeleteConfirm.nombre}"</strong>?</p>
                  <p className="warning-text">Esta acción no se puede deshacer.</p>
                  <div className="form-actions">
                    <button 
                      className="btn-delete-confirm"
                      onClick={() => {
                        if (showDeleteConfirm.type === 'emprendimiento') {
                          handleDeleteEmprendimiento(showDeleteConfirm.id);
                        } else {
                          handleDeleteProduct(showDeleteConfirm.id, showDeleteConfirm.emprendimientoId);
                        }
                      }}
                    >
                      Sí, Eliminar
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => setShowDeleteConfirm(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MisEmprendimientos;