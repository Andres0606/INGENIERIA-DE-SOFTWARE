import React, { useState, useEffect } from 'react';

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
                <button 
                  className="btn-comprar"
                  onClick={() => window.location.href = '/productos'}
                >
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

export default FavoritosSection;