import React, { useState, useEffect } from 'react';
import '../../Components/Eventos.css';
import Header from '../Header-footer/Header.jsx';
import Footer from '../Header-footer/Footer.jsx';
const Eventos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros de categorías
  const filtros = ['Todos', 'Ferias', 'Talleres', 'Networking', 'Conferencias', 'Competencias'];

  // Simular carga de datos
  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      // REEMPLAZA ESTO CON TU LLAMADA A LA API
      // const response = await fetch('tu-api-url/eventos');
      // const data = await response.json();
      // setEventos(data);
      
      setTimeout(() => {
        setEventos([
          {
            id: 1,
            nombre: 'Feria de Emprendimiento UCC 2025',
            categoria: 'Ferias',
            fecha: '15 de Noviembre, 2025',
            hora: '9:00 AM - 5:00 PM',
            ubicacion: 'Campus Principal UCC',
            asistentes: 250,
            destacado: true,
            imagen: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop'
          },
          {
            id: 2,
            nombre: 'Taller: Marketing Digital para Emprendedores',
            categoria: 'Talleres',
            fecha: '22 de Noviembre, 2025',
            hora: '2:00 PM - 5:00 PM',
            ubicacion: 'Auditorio Central',
            asistentes: 50,
            destacado: false,
            imagen: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop'
          },
          {
            id: 3,
            nombre: 'Networking: Conecta con Inversores',
            categoria: 'Networking',
            fecha: '28 de Noviembre, 2025',
            hora: '6:00 PM - 9:00 PM',
            ubicacion: 'Centro de Innovación',
            asistentes: 80,
            destacado: true,
            imagen: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop'
          },
          {
            id: 4,
            nombre: 'Conferencia: Tendencias del Emprendimiento 2025',
            categoria: 'Conferencias',
            fecha: '5 de Diciembre, 2025',
            hora: '10:00 AM - 1:00 PM',
            ubicacion: 'Auditorio Principal',
            asistentes: 200,
            destacado: false,
            imagen: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop'
          },
          {
            id: 5,
            nombre: 'Competencia: Pitch de Startups',
            categoria: 'Competencias',
            fecha: '12 de Diciembre, 2025',
            hora: '3:00 PM - 7:00 PM',
            ubicacion: 'Teatro Universitario',
            asistentes: 150,
            destacado: true,
            imagen: 'https://images.unsplash.com/photo-1559223607-a43c990d28b7?w=800&h=400&fit=crop'
          },
          {
            id: 6,
            nombre: 'Taller: Finanzas para Emprendedores',
            categoria: 'Talleres',
            fecha: '18 de Diciembre, 2025',
            hora: '2:00 PM - 5:00 PM',
            ubicacion: 'Sala de Capacitación',
            asistentes: 40,
            destacado: false,
            imagen: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop'
          }
        ]);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setLoading(false);
    }
  };

  // Filtrar eventos
  const eventosFiltrados = eventos.filter(evento => {
    const matchFilter = selectedFilter === 'Todos' || evento.categoria === selectedFilter;
    const matchSearch = evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       evento.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <> 
    <Header></Header>
    <div className="eventos-page">
      {/* Header Section */}
      <section className="eventos-header">
        <h1 className="eventos-title">Eventos UCC</h1>
        <p className="eventos-subtitle">
          Participa en ferias, talleres y actividades de networking exclusivas
        </p>
      </section>

      {/* Search and Filters */}
      <section className="eventos-filters-section">
        <div className="eventos-container">
          {/* Search Bar */}
          <div className="eventos-search-box">
            <input
              type="text"
              className="eventos-search-input"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="eventos-search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Filters */}
          <div className="eventos-filters">
            <svg className="filter-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            {filtros.map((filtro, index) => (
              <button
                key={index}
                className={`filter-btn ${selectedFilter === filtro ? 'active' : ''}`}
                onClick={() => setSelectedFilter(filtro)}
              >
                {filtro}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Eventos Grid */}
      <section className="eventos-grid-section">
        <div className="eventos-container">
          {loading && (
            <div className="loading-state-eventos">
              <div className="spinner-eventos"></div>
              <p>Cargando eventos...</p>
            </div>
          )}

          {!loading && eventosFiltrados.length === 0 && (
            <div className="empty-state-eventos">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <h3>No se encontraron eventos</h3>
              <p>Intenta con otros filtros de búsqueda</p>
            </div>
          )}

          <div className="eventos-grid">
            {!loading && eventosFiltrados.map((evento) => (
              <div key={evento.id} className="evento-card">
                {/* Badge destacado */}
                {evento.destacado && (
                  <div className="destacado-badge">DESTACADO</div>
                )}

                {/* Imagen */}
                <div className="evento-imagen">
                  <img src={evento.imagen} alt={evento.nombre} />
                  <div className="evento-overlay"></div>
                </div>

                {/* Contenido */}
                <div className="evento-content">
                  <span className="evento-categoria">{evento.categoria}</span>
                  <h3 className="evento-nombre">{evento.nombre}</h3>

                  {/* Detalles del evento */}
                  <div className="evento-detalles">
                    <div className="detalle-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>{evento.fecha}</span>
                    </div>

                    <div className="detalle-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span>{evento.hora}</span>
                    </div>

                    <div className="detalle-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{evento.ubicacion}</span>
                    </div>

                    <div className="detalle-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <span>{evento.asistentes} asistentes</span>
                    </div>
                  </div>

                  {/* Botón */}
                  <button className="ver-detalles-btn">
                    Ver Detalles
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    <Footer></Footer>
    </>
  );
};

export default Eventos;