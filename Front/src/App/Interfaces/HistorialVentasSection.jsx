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

  // Función para contactar por WhatsApp
  const contactarWhatsApp = (comprador, producto) => {
    const telefono = comprador.telefono;
    const nombreComprador = `${comprador.nombres} ${comprador.apellidos}`;
    const nombreProducto = producto.nombre;
    
    if (!telefono) {
      alert('Este comprador no tiene número de teléfono registrado');
      return;
    }

    // Mensaje predefinido para vendedores
    const mensaje = `¡Hola ${nombreComprador}! 👋\n\nSoy tu vendedor de "${nombreProducto}" en Emprende UCC. Quería agradecerte por tu compra y ver si tienes alguna pregunta sobre el producto.`;
    
    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Formatear número de teléfono y agregar +57
    const telefonoLimpio = telefono
      .replace(/\s+/g, '')        // Remover espacios
      .replace(/-/g, '')          // Remover guiones
      .replace(/\./g, '')         // Remover puntos
      .replace(/\(/g, '')         // Remover paréntesis izquierdo
      .replace(/\)/g, '')         // Remover paréntesis derecho
      .replace(/^\+?57/, '')      // Remover +57 o 57 si ya está al inicio
      .replace(/^0/, '');         // Remover 0 inicial si existe

    // Agregar +57 al inicio
    const telefonoConCodigo = `57${telefonoLimpio}`;
    
    // Validar que sea un número válido (solo dígitos, 10 dígitos)
    if (!/^\d{10}$/.test(telefonoLimpio)) {
      alert('El número de teléfono no tiene un formato válido. Debe tener 10 dígitos.');
      return;
    }
    
    console.log('Teléfono formateado:', telefonoConCodigo);
    
    // Crear URL de WhatsApp
    const urlWhatsApp = `https://wa.me/${telefonoConCodigo}?text=${mensajeCodificado}`;
    
    // Abrir en nueva pestaña
    window.open(urlWhatsApp, '_blank');
  };

  // Función para contactar por correo
  const contactarCorreo = (comprador, producto) => {
    const correo = comprador.correo;
    const nombreComprador = `${comprador.nombres} ${comprador.apellidos}`;
    const nombreProducto = producto.nombre;
    
    const asunto = `Sobre tu compra: ${nombreProducto}`;
    const cuerpo = `Hola ${nombreComprador},\n\nSoy tu vendedor de "${nombreProducto}" en Emprende UCC. Quería agradecerte por tu compra y ver si tienes alguna pregunta sobre el producto.\n\n¡Gracias por tu confianza!\n\nSaludos cordiales.`;
    
    const mailtoLink = `mailto:${correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    
    window.location.href = mailtoLink;
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
                {venta.comprador.telefono && (
                  <div className="detail-group">
                    <span className="label">Teléfono:</span>
                    <span className="value">+57 {venta.comprador.telefono}</span>
                  </div>
                )}
                <div className="detail-group">
                  <span className="label">Correo:</span>
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
                {venta.comprador.telefono && (
                  <button 
                    className="btn-whatsapp"
                    onClick={() => contactarWhatsApp(venta.comprador, venta.producto)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '6px' }}>
                      <path d="M13.5 2.5a6.5 6.5 0 0 1-11.3 4.4L1 15l4.1-1.2A6.5 6.5 0 0 0 13.5 2.5z"/>
                    </svg>
                    WhatsApp
                  </button>
                )}
                <button 
                  className="btn-correo"
                  onClick={() => contactarCorreo(venta.comprador, venta.producto)}
                >
                  📧 Correo
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