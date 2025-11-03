import React, { useState, useEffect } from 'react';
import '../../Components/Emprendedores.css';


const Emprendedores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [emprendedores, setEmprendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categorías con contadores
  const categorias = [
    { nombre: 'Todos', count: 0 },
    { nombre: 'Tecnología', count: 0 },
    { nombre: 'Salud', count: 0 },
    { nombre: 'Educación', count: 0 },
    { nombre: 'Comercio', count: 0 },
    { nombre: 'Servicios', count: 0 }
  ];

  // Simular carga de datos - AQUÍ CONECTARÁS TU API
  useEffect(() => {
    fetchEmprendedores();
  }, []);

  const fetchEmprendedores = async () => {
    try {
      setLoading(true);
      // REEMPLAZA ESTO CON TU LLAMADA A LA API
      // const response = await fetch('tu-api-url/emprendedores');
      // const data = await response.json();
      // setEmprendedores(data);
      
      // Datos de ejemplo (elimina esto cuando conectes tu API)
      setTimeout(() => {
        setEmprendedores([
          {
            id: 1,
            nombre: 'Juan Pérez',
            categoria: 'Tecnología',
            descripcion: 'Desarrollo de aplicaciones móviles innovadoras',
            imagen: 'https://i.pravatar.cc/150?img=12',
            ubicacion: 'Villavicencio',
            email: 'juan@example.com'
          },
          {
            id: 2,
            nombre: 'María González',
            categoria: 'Salud',
            descripcion: 'Productos naturales para el bienestar',
            imagen: 'https://i.pravatar.cc/150?img=47',
            ubicacion: 'Bogotá',
            email: 'maria@example.com'
          },
          {
            id: 3,
            nombre: 'Carlos Rodríguez',
            categoria: 'Educación',
            descripcion: 'Plataforma de tutorías en línea',
            imagen: 'https://i.pravatar.cc/150?img=33',
            ubicacion: 'Medellín',
            email: 'carlos@example.com'
          },
          {
            id: 4,
            nombre: 'Ana Martínez',
            categoria: 'Comercio',
            descripcion: 'Tienda de productos artesanales',
            imagen: 'https://i.pravatar.cc/150?img=20',
            ubicacion: 'Cali',
            email: 'ana@example.com'
          },
          {
            id: 5,
            nombre: 'Luis Hernández',
            categoria: 'Servicios',
            descripcion: 'Consultoría empresarial para startups',
            imagen: 'https://i.pravatar.cc/150?img=8',
            ubicacion: 'Villavicencio',
            email: 'luis@example.com'
          },
          {
            id: 6,
            nombre: 'Sandra López',
            categoria: 'Tecnología',
            descripcion: 'Soluciones de inteligencia artificial',
            imagen: 'https://i.pravatar.cc/150?img=45',
            ubicacion: 'Bogotá',
            email: 'sandra@example.com'
          }
        ]);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Error al cargar emprendedores');
      setLoading(false);
    }
  };

  // Filtrar emprendedores
  const emprendedoresFiltrados = emprendedores.filter(emp => {
    const matchCategory = selectedCategory === 'Todos' || emp.categoria === selectedCategory;
    const matchSearch = emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       emp.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       emp.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Calcular contadores de categorías
  const categoriasConContadores = categorias.map(cat => ({
    ...cat,
    count: cat.nombre === 'Todos' 
      ? emprendedores.length 
      : emprendedores.filter(emp => emp.categoria === cat.nombre).length
  }));

  return (
    <>
   
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
            placeholder="Busca por nombre, categoría o ubicación..."
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
            <div key={emprendedor.id} className="emprendedor-card">
              <div className="card-image">
                <img src={emprendedor.imagen} alt={emprendedor.nombre} />
                <span className="card-badge">{emprendedor.categoria}</span>
              </div>
              <div className="card-content">
                <h3 className="card-name">{emprendedor.nombre}</h3>
                <p className="card-description">{emprendedor.descripcion}</p>
                <div className="card-footer">
                  <div className="card-location">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13 6.5c0 3.75-5 7.5-5 7.5s-5-3.75-5-7.5a5 5 0 1 1 10 0z" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="8" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <span>{emprendedor.ubicacion}</span>
                  </div>
                  <button className="card-contact-btn">Contactar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
   
    </>
  );
};

export default Emprendedores;