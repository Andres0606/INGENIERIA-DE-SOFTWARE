import React, { useState, useEffect } from 'react';
import '../../Components/Productos.css';
import Header from '../Header-footer/Header.jsx';
import Footer from '../Header-footer/Footer.jsx';

const Productos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

  // Cargar productos, categorías y favoritos
  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    if (userData.idusuario) {
      fetchFavoritos();
    }
  }, [userData.idusuario]);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/productos');
      const data = await response.json();
      
      if (data.success) {
        setProductos(data.data);
      } else {
        throw new Error(data.message || 'Error al cargar productos');
      }
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('Error al cargar productos. Intenta nuevamente.');
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

  const fetchFavoritos = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/favoritos/usuario/${userData.idusuario}`);
      const data = await response.json();
      
      if (data.success) {
        const idsFavoritos = data.data.map(fav => fav.idproducto);
        setFavoritos(idsFavoritos);
      }
    } catch (err) {
      console.error('Error cargando favoritos:', err);
    }
  };

  // Toggle favorito
  const toggleFavorito = async (idproducto) => {
    if (!userData.idusuario) {
      alert('Debes iniciar sesión para agregar favoritos');
      return;
    }

    try {
      const esFavorito = favoritos.includes(idproducto);
      
      if (esFavorito) {
        // Eliminar favorito
        const response = await fetch('http://localhost:3000/api/favoritos/eliminar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idusuario: userData.idusuario,
            idproducto: idproducto
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setFavoritos(prev => prev.filter(id => id !== idproducto));
        } else {
          throw new Error(data.message);
        }
      } else {
        // Agregar favorito
        const response = await fetch('http://localhost:3000/api/favoritos/agregar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idusuario: userData.idusuario,
            idproducto: idproducto
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setFavoritos(prev => [...prev, idproducto]);
        } else {
          throw new Error(data.message);
        }
      }
    } catch (err) {
      console.error('Error gestionando favorito:', err);
      alert('Error al gestionar favorito: ' + err.message);
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(prod => {
    const matchCategory = selectedCategory === 'Todos' || 
                         (prod.emprendimiento?.categoria?.nombre === selectedCategory);
    const matchSearch = prod.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       prod.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       prod.emprendimiento?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       `${prod.emprendimiento?.usuario?.nombres} ${prod.emprendimiento?.usuario?.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Obtener categorías únicas de los productos
  const categoriasUnicas = ['Todos', ...new Set(
    productos
      .filter(prod => prod.emprendimiento?.categoria?.nombre)
      .map(prod => prod.emprendimiento.categoria.nombre)
  )];

  // Calcular contadores de categorías
  const categoriasConContadores = categoriasUnicas.map(cat => ({
    nombre: cat,
    count: cat === 'Todos' 
      ? productos.length 
      : productos.filter(prod => prod.emprendimiento?.categoria?.nombre === cat).length
  }));

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Generar color único basado en el ID del producto
  const generarColor = (id) => {
    const colors = [
      'linear-gradient(135deg, #86C447 0%, #4A9D7F 100%)',
      'linear-gradient(135deg, #7ED957 0%, #3EA89D 100%)',
      'linear-gradient(135deg, #91D14F 0%, #459B8E 100%)',
      'linear-gradient(135deg, #8BC84D 0%, #47A285 100%)',
      'linear-gradient(135deg, #7FCC51 0%, #4B9A81 100%)',
      'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
      'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
      'linear-gradient(135deg, #45B7D1 0%, #96CEB4 100%)',
      'linear-gradient(135deg, #FECA57 0%, #FF9FF3 100%)',
      'linear-gradient(135deg, #54A0FF 0%, #5F27CD 100%)'
    ];
    return colors[id % colors.length];
  };

  // Generar emoji basado en la categoría
  const generarEmoji = (categoria) => {
    const emojis = {
      'Tecnología': '💻',
      'Alimentos': '🍕',
      'Moda': '👕',
      'Hogar': '🏠',
      'Artesanía': '🎨',
      'Servicios': '🔧',
      'Educación': '📚',
      'Salud': '⚕️',
      'Comercio': '🛒'
    };
    return emojis[categoria] || '📦';
  };

  return (
    <>
      <Header />
      <div className="productos-page">
        {/* Header Section */}
        <section className="productos-header">
          <h1 className="productos-title">Marketplace de Productos</h1>
          <p className="productos-subtitle">
            Descubre productos únicos de emprendedores UCC
            {userData.idusuario && (
              <span className="favoritos-link">
                · <a href="/perfil#favoritos">Ver mis favoritos ({favoritos.length})</a>
              </span>
            )}
          </p>
          
          {/* Search Bar */}
          <div className="search-box-productos">
            <svg className="search-icon-productos" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              className="search-input-productos"
              placeholder="Busca productos, emprendedores o categorías..."
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
              {categoriasConContadores.map((cat, index) => (
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

            {error && (
              <div className="error-state-productos">
                <p>{error}</p>
                <button onClick={fetchProductos} className="retry-btn">
                  Reintentar
                </button>
              </div>
            )}

            {!loading && !error && productosFiltrados.length === 0 && (
              <div className="empty-state-productos">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01"/>
                </svg>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros filtros de búsqueda</p>
              </div>
            )}

            {!loading && !error && productosFiltrados.map((producto) => (
              <div key={producto.idproducto} className="producto-card">
                {/* Imagen con gradiente */}
                <div 
                  className="producto-image" 
                  style={{ 
                    background: generarColor(producto.idproducto),
                    backgroundImage: generarColor(producto.idproducto)
                  }}
                >
                  <span className="producto-emoji">
                    {generarEmoji(producto.emprendimiento?.categoria?.nombre)}
                  </span>
                  <button 
                    className={`favorito-btn ${favoritos.includes(producto.idproducto) ? 'active' : ''}`}
                    onClick={() => toggleFavorito(producto.idproducto)}
                    title={favoritos.includes(producto.idproducto) ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={favoritos.includes(producto.idproducto) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>

                {/* Contenido */}
                <div className="producto-content">
                  <h3 className="producto-nombre">{producto.nombre}</h3>
                  <p className="producto-descripcion">
                    {producto.descripcion || 'Descripción no disponible'}
                  </p>
                  
                  {/* Información del emprendimiento */}
                  <div className="producto-emprendimiento">
                    <span className="emprendimiento-nombre">
                      {producto.emprendimiento?.nombre}
                    </span>
                    <span className="emprendimiento-categoria">
                      {producto.emprendimiento?.categoria?.nombre}
                    </span>
                  </div>

                  {/* Vendedor */}
                  <p className="producto-vendedor">
                    Por: {producto.emprendimiento?.usuario?.nombres} {producto.emprendimiento?.usuario?.apellidos}
                  </p>

                  {/* Footer con precio y botón */}
                  <div className="producto-footer">
                    <span className="producto-precio">
                      {formatPrice(producto.precio)}
                    </span>
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
      <Footer />
    </>
  );
};

export default Productos;