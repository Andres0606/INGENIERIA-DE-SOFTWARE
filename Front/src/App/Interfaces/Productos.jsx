import React, { useState, useEffect } from 'react';
import '../../Components/Productos.css';
import Header from '../Header-footer/Header.jsx';
import Footer from '../Header-footer/Footer.jsx';
const Productos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [productos, setProductos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categorías con contadores
  const categorias = [
    { nombre: 'Todos', count: 42 },
    { nombre: 'Artesanía', count: 4 },
    { nombre: 'Alimentos', count: 4 },
    { nombre: 'Moda', count: 2 },
    { nombre: 'Hogar', count: 2 },
    { nombre: 'Servicios', count: 0 }
  ];

  // Simular carga de datos
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      // REEMPLAZA ESTO CON TU LLAMADA A LA API
      // const response = await fetch('tu-api-url/productos');
      // const data = await response.json();
      // setProductos(data);
      
      setTimeout(() => {
        setProductos([
          {
            id: 1,
            nombre: 'Bolsos Tejidos Artesanales',
            descripcion: 'Bolsos únicos tejidos a mano con técnicas tradicionales',
            precio: 85000,
            rating: 4.8,
            ventas: 42,
            vendedor: 'María González',
            categoria: 'Artesanía',
            imagen: '🛍️',
            color: 'linear-gradient(135deg, #86C447 0%, #4A9D7F 100%)'
          },
          {
            id: 2,
            nombre: 'Café Gourmet Villavicencio',
            descripcion: 'Café de alta calidad tostado artesanalmente',
            precio: 35000,
            rating: 4.9,
            ventas: 128,
            vendedor: 'Carlos Rodríguez',
            categoria: 'Alimentos',
            imagen: '☕',
            color: 'linear-gradient(135deg, #86C447 0%, #3E8E8B 100%)'
          },
          {
            id: 3,
            nombre: 'Ropa Ecológica Sostenible',
            descripcion: 'Prendas de algodón orgánico y teñidas naturalmente',
            precio: 65000,
            rating: 4.7,
            ventas: 67,
            vendedor: 'Ana Martínez',
            categoria: 'Moda',
            imagen: '👕',
            color: 'linear-gradient(135deg, #7ED957 0%, #3EA89D 100%)'
          },
          {
            id: 4,
            nombre: 'Velas Aromáticas Artesanales',
            descripcion: 'Velas hechas con cera de soja y aceites esenciales',
            precio: 25000,
            rating: 4.6,
            ventas: 89,
            vendedor: 'Laura Silva',
            categoria: 'Hogar',
            imagen: '🕯️',
            color: 'linear-gradient(135deg, #91D14F 0%, #459B8E 100%)'
          },
          {
            id: 5,
            nombre: 'Miel Orgánica de Montaña',
            descripcion: 'Miel pura recolectada en las montañas del Meta',
            precio: 45000,
            rating: 5.0,
            ventas: 156,
            vendedor: 'Pedro Ramírez',
            categoria: 'Alimentos',
            imagen: '🍯',
            color: 'linear-gradient(135deg, #8BC84D 0%, #47A285 100%)'
          },
          {
            id: 6,
            nombre: 'Joyería en Plata Artesanal',
            descripcion: 'Piezas únicas de plata 925 diseñadas a mano',
            precio: 120000,
            rating: 4.9,
            ventas: 34,
            vendedor: 'Sofía Herrera',
            categoria: 'Artesanía',
            imagen: '💍',
            color: 'linear-gradient(135deg, #7FCC51 0%, #4B9A81 100%)'
          }
        ]);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setLoading(false);
    }
  };

  // Toggle favorito
  const toggleFavorito = (id) => {
    setFavoritos(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(prod => {
    const matchCategory = selectedCategory === 'Todos' || prod.categoria === selectedCategory;
    const matchSearch = prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       prod.vendedor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
    <Header></Header>
    <div className="productos-page">
      {/* Header Section */}
      <section className="productos-header">
        <h1 className="productos-title">Marketplace de Productos</h1>
        <p className="productos-subtitle">
          Descubre productos artesanales y alimentos de emprendedores UCC
        </p>
        
        {/* Search Bar */}
        <div className="search-box-productos">
          <svg className="search-icon-productos" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            className="search-input-productos"
            placeholder="Busca productos, emprendedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="productos-content">
        {/* Sidebar - Categorías */}
        <aside className="categorias-sidebar-productos">
          <h3 className="sidebar-title-productos">Categorías</h3>
          <div className="categorias-list-productos">
            {categorias.map((cat, index) => (
              <button
                key={index}
                className={`categoria-btn-productos ${selectedCategory === cat.nombre ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.nombre)}
              >
                <span>{cat.nombre}</span>
                <span className="categoria-count-productos">{cat.count}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content - Productos Grid */}
        <div className="productos-grid">
          {loading && (
            <div className="loading-state-productos">
              <div className="spinner-productos"></div>
              <p>Cargando productos...</p>
            </div>
          )}

          {!loading && productosFiltrados.length === 0 && (
            <div className="empty-state-productos">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
              <h3>No se encontraron productos</h3>
              <p>Intenta con otros filtros de búsqueda</p>
            </div>
          )}

          {!loading && productosFiltrados.map((producto) => (
            <div key={producto.id} className="producto-card">
              {/* Imagen con gradiente */}
              <div className="producto-image" style={{ background: producto.color }}>
                <span className="producto-emoji">{producto.imagen}</span>
                <button 
                  className={`favorito-btn ${favoritos.includes(producto.id) ? 'active' : ''}`}
                  onClick={() => toggleFavorito(producto.id)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={favoritos.includes(producto.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>

              {/* Contenido */}
              <div className="producto-content">
                <h3 className="producto-nombre">{producto.nombre}</h3>
                <p className="producto-descripcion">{producto.descripcion}</p>
                
                {/* Rating y ventas */}
                <div className="producto-rating">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="rating-number">{producto.rating}</span>
                  <span className="ventas-number">({producto.ventas} vendidos)</span>
                </div>

                {/* Vendedor */}
                <p className="producto-vendedor">Por: {producto.vendedor}</p>

                {/* Footer con precio y botón */}
                <div className="producto-footer">
                  <span className="producto-precio">{formatPrice(producto.precio)}</span>
                  <button className="comprar-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    <Footer></Footer>
    </>
  );
};

export default Productos;