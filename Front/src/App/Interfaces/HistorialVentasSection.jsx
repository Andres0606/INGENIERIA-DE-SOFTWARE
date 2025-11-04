import React, { useState, useEffect } from 'react';

const HistorialVentasSection = ({ userId }) => {
  const [ventas, setVentas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVentas();
  }, [userId]);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/transacciones/ventas/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setVentas(data.data.ventas);
        setEstadisticas(data.data.estadisticas);
        
        // ACTUALIZAR SESSION STORAGE CON EL SALDO ACTUAL
        const userDataStored = JSON.parse(sessionStorage.getItem('userData') || '{}');
        const updatedUserData = {
          ...userDataStored,
          saldo: data.data.saldoActual || data.data.estadisticas?.saldoActual || 0
        };
        sessionStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        console.log('✅ Saldo actualizado en sessionStorage:', updatedUserData.saldo);
      } else {
        throw new Error(data.message || 'Error al cargar ventas');
      }
    } catch (err) {
      console.error('Error cargando ventas:', err);
      setError('Error al cargar el historial de ventas');
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
        <div className="saldo-actual-header">
          <h2>Historial de Ventas</h2>
          <div className="saldo-emprendedor">
            <span className="saldo-label">Saldo disponible:</span>
            <span className="saldo-monto">Cargando...</span>
          </div>
        </div>
        <div className="loading-section">
          <div className="spinner-ventas"></div>
          <p>Cargando historial de ventas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historial-section">
        <div className="saldo-actual-header">
          <h2>Historial de Ventas</h2>
          <div className="saldo-emprendedor">
            <span className="saldo-label">Saldo disponible:</span>
            <span className="saldo-monto">Error</span>
          </div>
        </div>
        <div className="error-section">
          <p>{error}</p>
          <button onClick={fetchVentas} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="historial-section">
      {/* Header con saldo actualizado */}
      <div className="saldo-actual-header">
        <h2>Historial de Ventas ({ventas.length})</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="saldo-emprendedor">
            <span className="saldo-label">Saldo disponible:</span>
            <span className="saldo-monto">
              {formatPrice(estadisticas.saldoActual || 0)}
            </span>
          </div>
          <button 
            className="btn-actualizar-saldo"
            onClick={fetchVentas}
            title="Actualizar saldo y ventas"
          >
            🔄 Actualizar
          </button>
        </div>
      </div>
      
      {/* Estadísticas */}
      <div className="estadisticas-resumen">
        <div className="estadistica-item">
          <strong>Ingresos totales:</strong> 
          <span>{formatPrice(estadisticas.ingresosTotales || 0)}</span>
        </div>
        <div className="estadistica-item">
          <strong>Ventas realizadas:</strong> 
          <span>{estadisticas.totalVentas || 0}</span>
        </div>
        <div className="estadistica-item">
          <strong>Productos vendidos:</strong> 
          <span>{estadisticas.productosVendidos || 0}</span>
        </div>
      </div>

      {/* Lista de ventas */}
      <div className="ventas-list">
        {ventas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💰</div>
            <h3>No has realizado ventas aún</h3>
            <p>Cuando vendas productos, aparecerán aquí</p>
            <button 
              className="btn-explorar"
              onClick={() => window.location.href = '/mis-emprendimientos?tab=emprendimientos'}
            >
              Gestionar Emprendimientos
            </button>
          </div>
        ) : (
          ventas.map(venta => (
            <div key={venta.idtransaccion} className="venta-item">
              <div className="venta-header">
                <div className="venta-producto-info">
                  <div className="producto-imagen">
                    {venta.producto.nombre?.charAt(0) || '📦'}
                  </div>
                  <div className="producto-detalles">
                    <h4 className="producto-nombre">{venta.producto.nombre}</h4>
                    <div className="producto-precio">
                      {formatPrice(venta.producto.precio)} c/u
                    </div>
                  </div>
                </div>
                <span className="venta-fecha">
                  {formatDate(venta.fecha_transaccion)}
                </span>
              </div>
              
              <div className="venta-details">
                <div className="detail-group">
                  <span className="label">Cantidad:</span>
                  <span className="value">{venta.cantidad} unidades</span>
                </div>
                <div className="detail-group">
                  <span className="label">Precio unitario:</span>
                  <span className="value">{formatPrice(venta.producto.precio)}</span>
                </div>
                <div className="detail-group">
                  <span className="label">Total de la venta:</span>
                  <span className="value total">{formatPrice(venta.monto_total)}</span>
                </div>
                <div className="detail-group">
                  <span className="label">Comprador:</span>
                  <span className="value">{venta.comprador.nombres} {venta.comprador.apellidos}</span>
                </div>
                <div className="detail-group">
                  <span className="label">Contacto:</span>
                  <span className="value">{venta.comprador.correo}</span>
                </div>
                <div className="detail-group">
                  <span className="label">Emprendimiento:</span>
                  <span className="value">{venta.producto.emprendimiento?.nombre || 'N/A'}</span>
                </div>
                <div className="detail-group">
                  <span className="label">Estado:</span>
                  <span className={`estado estado-badge ${venta.estado}`}>
                    {venta.estado}
                  </span>
                </div>
              </div>
              
              <div className="venta-actions">
                <button 
                  className="btn-contactar-comprador"
                  onClick={() => {
                    const mensaje = `Hola ${venta.comprador.nombres}, soy el vendedor de "${venta.producto.nombre}". Gracias por tu compra!`;
                    const contacto = `Correo: ${venta.comprador.correo}`;
                    alert(`📧 Contactar al comprador:\n\n${contacto}\n\nMensaje sugerido:\n${mensaje}`);
                  }}
                >
                  📧 Contactar al comprador
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorialVentasSection;