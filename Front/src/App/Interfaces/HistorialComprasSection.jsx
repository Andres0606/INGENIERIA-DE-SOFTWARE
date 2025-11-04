import React, { useState, useEffect } from 'react';

const HistorialComprasSection = ({ userId }) => {
  const [compras, setCompras] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompras();
  }, [userId]);

  const fetchCompras = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/transacciones/compras/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setCompras(data.data.compras);
        setEstadisticas(data.data.estadisticas);
      } else {
        throw new Error(data.message || 'Error al cargar compras');
      }
    } catch (err) {
      console.error('Error cargando compras:', err);
      setError('Error al cargar el historial de compras');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="historial-section">
        <h2>Mis Compras</h2>
        <div className="loading-section">Cargando historial de compras...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historial-section">
        <h2>Mis Compras</h2>
        <div className="error-section">
          <p>{error}</p>
          <button onClick={fetchCompras} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="historial-section">
      <h2>Mis Compras ({compras.length})</h2>
      
      {/* Estadísticas */}
      <div className="estadisticas-resumen">
        <div className="estadistica-item">
          <strong>Total gastado:</strong> {formatPrice(estadisticas.totalGastado || 0)}
        </div>
        <div className="estadistica-item">
          <strong>Compras realizadas:</strong> {estadisticas.totalCompras || 0}
        </div>
        <div className="estadistica-item">
          <strong>Productos comprados:</strong> {estadisticas.productosComprados || 0}
        </div>
      </div>

      {/* Lista de compras */}
      <div className="compras-list">
        {compras.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>No has realizado compras aún</h3>
            <p>Cuando compres productos, aparecerán aquí</p>
            <button 
              className="btn-explorar"
              onClick={() => window.location.href = '/productos'}
            >
              Explorar Productos
            </button>
          </div>
        ) : (
          compras.map(compra => (
            <div key={compra.idtransaccion} className="compra-item">
              <div className="compra-header">
                <h4>{compra.producto.nombre}</h4>
                <span className="compra-fecha">
                  {formatDate(compra.fecha_transaccion)}
                </span>
              </div>
              <div className="compra-details">
                <div className="detail-group">
                  <span className="label">Cantidad:</span>
                  <span className="value">{compra.cantidad} unidades</span>
                </div>
                <div className="detail-group">
                  <span className="label">Precio unitario:</span>
                  <span className="value">{formatPrice(compra.producto.precio)}</span>
                </div>
                <div className="detail-group">
                  <span className="label">Total:</span>
                  <span className="value total">{formatPrice(compra.monto_total)}</span>
                </div>
                <div className="detail-group">
                  <span className="label">Vendedor:</span>
                  <span className="value">{compra.vendedor.nombres} {compra.vendedor.apellidos}</span>
                </div>
                <div className="detail-group">
                  <span className="label">Estado:</span>
                  <span className={`estado ${compra.estado}`}>
                    {compra.estado}
                  </span>
                </div>
              </div>
              <div className="compra-actions">
                <button 
                  className="btn-contactar"
                  onClick={() => {
                    const mensaje = `Hola ${compra.vendedor.nombres}, tengo una consulta sobre mi compra de "${compra.producto.nombre}"`;
                    alert(`Contactar a: ${compra.vendedor.correo}\n\nMensaje: ${mensaje}`);
                  }}
                >
                  📧 Contactar al vendedor
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorialComprasSection;