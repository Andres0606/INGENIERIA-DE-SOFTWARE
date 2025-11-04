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

  // Función para contactar por WhatsApp
  const contactarWhatsApp = (vendedor, producto) => {
    const telefono = vendedor.telefono;
    const nombreVendedor = `${vendedor.nombres} ${vendedor.apellidos}`;
    const nombreProducto = producto.nombre;
    
    if (!telefono) {
      alert('Este vendedor no tiene número de teléfono registrado');
      return;
    }

    // Mensaje predefinido
    const mensaje = `¡Hola ${nombreVendedor}! 👋\n\nTengo una consulta sobre mi compra de "${nombreProducto}" que realicé a través de Emprende UCC.`;
    
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
  const contactarCorreo = (vendedor, producto) => {
    const correo = vendedor.correo;
    const nombreVendedor = `${vendedor.nombres} ${vendedor.apellidos}`;
    const nombreProducto = producto.nombre;
    
    const asunto = `Consulta sobre compra: ${nombreProducto}`;
    const cuerpo = `Hola ${nombreVendedor},\n\nTengo una consulta sobre mi compra de "${nombreProducto}" que realicé a través de Emprende UCC.\n\nSaludos cordiales.`;
    
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
                {compra.vendedor.telefono && (
                  <div className="detail-group">
                    <span className="label">Teléfono:</span>
                    <span className="value">+57 {compra.vendedor.telefono}</span>
                  </div>
                )}
                <div className="detail-group">
                  <span className="label">Correo:</span>
                  <span className="value">{compra.vendedor.correo}</span>
                </div>
                <div className="detail-group">
                  <span className="label">Estado:</span>
                  <span className={`estado ${compra.estado}`}>
                    {compra.estado}
                  </span>
                </div>
              </div>
              <div className="compra-actions">
                {compra.vendedor.telefono && (
                  <button 
                    className="btn-whatsapp"
                    onClick={() => contactarWhatsApp(compra.vendedor, compra.producto)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '6px' }}>
                      <path d="M13.5 2.5a6.5 6.5 0 0 1-11.3 4.4L1 15l4.1-1.2A6.5 6.5 0 0 0 13.5 2.5z"/>
                    </svg>
                    WhatsApppp
                  </button>
                )}
                <button 
                  className="btn-correo"
                  onClick={() => contactarCorreo(compra.vendedor, compra.producto)}
                >
                  📧 Correoo
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