import React, { useState, useEffect } from 'react';
import '../../Components/Emprendedores.css';
import Header from '../Header-footer/Header.jsx';
import Footer from '../Header-footer/Footer.jsx';

const Emprendedores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [emprendedores, setEmprendedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar emprendedores y categorías desde el backend
  useEffect(() => {
    fetchEmprendedores();
    fetchCategorias();
  }, []);

  const fetchEmprendedores = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/emprendimientos/emprendedores');
      const data = await response.json();
      
      if (data.success) {
        setEmprendedores(data.data);
      } else {
        throw new Error(data.message || 'Error al cargar emprendedores');
      }
    } catch (err) {
      console.error('Error cargando emprendedores:', err);
      setError('Error al cargar emprendedores. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/categorias');
      const data = await response.json();
      if (data.success) {
        setCategorias(data.data);
      }
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  // Función para enviar mensaje por WhatsApp
  const contactarWhatsApp = (emprendedor) => {
  const telefono = emprendedor.usuario?.telefono;
  const nombreEmprendedor = `${emprendedor.usuario?.nombres} ${emprendedor.usuario?.apellidos}`;
  const nombreEmprendimiento = emprendedor.nombre;
  
  if (!telefono) {
    alert('Este emprendedor no tiene número de teléfono registrado');
    return;
  }

  // Validar formato básico del teléfono
  const telefonoValido = /^[\d\s\+\-\(\)\.]{10,15}$/.test(telefono);
  if (!telefonoValido) {
    alert('El número de teléfono no tiene un formato válido');
    return;
  }

  // Limpiar y formatear el número
  const telefonoLimpio = telefono
    .replace(/\s+/g, '')        // Remover espacios
    .replace(/-/g, '')          // Remover guiones
    .replace(/\./g, '')         // Remover puntos
    .replace(/\(/g, '')         // Remover paréntesis izquierdo
    .replace(/\)/g, '')         // Remover paréntesis derecho
    .replace(/^\+/, '');        // Remover + inicial si existe

  let telefonoConCodigo;

  // Si el número ya empieza con 57 y tiene 12 dígitos, usarlo tal cual
  if (/^57\d{10}$/.test(telefonoLimpio)) {
    telefonoConCodigo = telefonoLimpio;
  }
  // Si el número tiene 10 dígitos (sin código de país), agregar 57
  else if (/^\d{10}$/.test(telefonoLimpio)) {
    telefonoConCodigo = `57${telefonoLimpio}`;
  }
  // Si tiene otro formato, mostrar error
  else {
    alert(`Formato de teléfono no reconocido: ${telefono}. Debe ser un número colombiano de 10 dígitos.`);
    return;
  }

  // Mensaje predefinido
  const mensaje = `¡Hola ${nombreEmprendedor}! 👋\n\nMe interesa tu emprendimiento "${nombreEmprendimiento}" que vi en Emprende UCC. Me gustaría obtener más información.`;
  
  // Codificar el mensaje para URL
  const mensajeCodificado = encodeURIComponent(mensaje);
  
  // Crear URL de WhatsApp
  const urlWhatsApp = `https://wa.me/${telefonoConCodigo}?text=${mensajeCodificado}`;
  
  console.log('URL de WhatsApp:', urlWhatsApp); // Para debugging
  
  // Abrir en nueva pestaña
  window.open(urlWhatsApp, '_blank');
};

  // Filtrar emprendedores
  const emprendedoresFiltrados = emprendedores.filter(emp => {
    const matchCategory = selectedCategory === 'Todos' || 
                         (emp.categoria && emp.categoria.nombre === selectedCategory);
    const matchSearch = emp.usuario?.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       emp.usuario?.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       emp.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (emp.categoria && emp.categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Obtener categorías únicas de los emprendimientos
  const categoriasUnicas = ['Todos', ...new Set(
    emprendedores
      .filter(emp => emp.categoria && emp.categoria.nombre)
      .map(emp => emp.categoria.nombre)
  )];

  // Calcular contadores de categorías
  const categoriasConContadores = categoriasUnicas.map(cat => ({
    nombre: cat,
    count: cat === 'Todos' 
      ? emprendedores.length 
      : emprendedores.filter(emp => emp.categoria && emp.categoria.nombre === cat).length
  }));

  // Generar avatar basado en el nombre
  const generarAvatar = (nombres, apellidos) => {
    const iniciales = `${nombres?.charAt(0) || ''}${apellidos?.charAt(0) || ''}`.toUpperCase();
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    const color = colors[iniciales.charCodeAt(0) % colors.length];
    
    return (
      <div 
        className="avatar-placeholder"
        style={{ backgroundColor: color }}
      >
        {iniciales}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="emprendedores-page">
        {/* Header Section */}
        <section className="emprendedores-header">
          <h1 className="emprendedores-title">Descubre Emprendedores</h1>
          <p className="emprendedores-subtitle">
            Conecta con los mejores emprendedores de la comunidad UCC
          </p>
          
          {/* Search Bar */}
          <div className="search-box">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Busca por nombre, categoría o emprendimiento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        {/* Content Section */}
        <section className="emprendedores-content">
          {/* Sidebar - Categorías */}
          <aside className="categorias-sidebar">
            <h3 className="sidebar-title">Categorías</h3>
            <div className="categorias-list">
              {categoriasConContadores.map((cat, index) => (
                <button
                  key={index}
                  className={`categoria-btn ${selectedCategory === cat.nombre ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.nombre)}
                >
                  {cat.nombre}
                  <span className="categoria-count">{cat.count}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content - Emprendedores Grid */}
          <div className="emprendedores-grid">
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Cargando emprendedores...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={fetchEmprendedores} className="retry-btn">
                  Reintentar
                </button>
              </div>
            )}

            {!loading && !error && emprendedoresFiltrados.length === 0 && (
              <div className="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01"/>
                </svg>
                <h3>No se encontraron emprendedores</h3>
                <p>Intenta con otros filtros de búsqueda</p>
              </div>
            )}

            {!loading && !error && emprendedoresFiltrados.map((emprendedor) => (
              <div key={emprendedor.idemprendimiento} className="emprendedor-card">
                <div className="card-image">
                  {generarAvatar(emprendedor.usuario?.nombres, emprendedor.usuario?.apellidos)}
                  <span className="card-badge">
                    {emprendedor.categoria?.nombre || 'Sin categoría'}
                  </span>
                </div>
                <div className="card-content">
                  <h3 className="card-name">
                    {emprendedor.usuario?.nombres} {emprendedor.usuario?.apellidos}
                  </h3>
                  <p className="card-emprendimiento">{emprendedor.nombre}</p>
                  <p className="card-description">
                    {emprendedor.descripcion || 'Sin descripción disponible'}
                  </p>
                  <div className="card-footer">
                    <div className="card-contact-info">
                      <div className="card-email">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 4l6 4 6-4M2 4h12v8H2z" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        <span>{emprendedor.usuario?.correo}</span>
                      </div>
                      {emprendedor.usuario?.telefono && (
                        <div className="card-phone">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM7.5 12h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          <span>{emprendedor.usuario.telefono}</span>
                        </div>
                      )}
                    </div>
                    <div className="card-actions">
                      <span className={`card-status ${emprendedor.estado}`}>
                        {emprendedor.estado}
                      </span>
                      <button 
                        className="card-contact-btn"
                        onClick={() => contactarWhatsApp(emprendedor)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '6px' }}>
                          <path d="M13.5 2.5a6.5 6.5 0 0 1-11.3 4.4L1 15l4.1-1.2A6.5 6.5 0 0 0 13.5 2.5z"/>
                        </svg>
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Emprendedores;