import React, { useState } from 'react';
import '../../Components/Contactos.css';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // REEMPLAZA ESTO CON TU LLAMADA A LA API
    // const response = await fetch('tu-api-url/contacto', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });

    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      setFormData({
        nombreCompleto: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      });
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  const faqs = [
    {
      pregunta: '¿Cómo puedo registrarme como emprendedor?',
      respuesta: 'Dirígete a la sección de registro y completa el formulario con tus datos.'
    },
    {
      pregunta: '¿Cuál es la comisión por venta?',
      respuesta: 'Cobramos una comisión del 10% en cada venta realizada a través de la plataforma. Este porcentaje nos ayuda a mantener el servicio.'
    },
    {
      pregunta: '¿Cómo recibo mis pagos?',
      respuesta: 'Los pagos se transfieren inmediatamente a tu cuenta bancaria una vez que se apruebe.'
    },
    {
      pregunta: '¿Puedo vender productos físicos y servicios?',
      respuesta: 'Sí, nuestra plataforma permite tanto venta de productos físicos como servicios. Solo consulta las políticas para más detalles.'
    },
    {
      pregunta: '¿Hay soporte técnico disponible?',
      respuesta: 'Sí, tenemos un equipo de soporte técnico disponible de lunes a viernes de 8am a 6pm. Contáctanos en cualquier Whatsapp.'
    },
    {
      pregunta: '¿Cómo reporto un problema con mi producto?',
      respuesta: 'Puedes reportar problemas directamente desde tu panel de control en tu perfil o contactar con nuestro equipo de soporte.'
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="contacto-page">
      {/* Header */}
      <section className="contacto-header">
        <h1 className="contacto-title">Contacto</h1>
        <p className="contacto-subtitle">¿Tienes preguntas? Nos encantaría escucharte</p>
      </section>

      {/* Información de Contacto */}
      <section className="contacto-info-section">
        <div className="contacto-container">
          <h2 className="section-title">Información de Contacto</h2>
          
          <div className="info-cards">
            {/* Ubicación */}
            <div className="info-card">
              <div className="info-icon ubicacion">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3 className="info-title">Ubicación</h3>
              <p className="info-detail">Villavicencio, Meta</p>
              <p className="info-subdetal">Universidad Cooperativa de Colombia</p>
            </div>

            {/* Teléfono */}
            <div className="info-card">
              <div className="info-icon telefono">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h3 className="info-title">Teléfono</h3>
              <p className="info-detail">+57 (6) 6723000</p>
              <p className="info-subdetal">Lunes a viernes - 8am - 6pm</p>
            </div>

            {/* Email */}
            <div className="info-card">
              <div className="info-icon email">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <h3 className="info-title">Email</h3>
              <p className="info-detail">info@emprendeucc.edu.co</p>
              <p className="info-subdetal">Responderemos en 24 horas</p>
            </div>

            {/* Redes Sociales */}
            <div className="info-card">
              <div className="info-icon redes">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </div>
              <h3 className="info-title">Redes Sociales</h3>
              <p className="info-detail">@EmprendeUCC</p>
              <p className="info-subdetal">Síguenos para más contenido</p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de Contacto */}
      <section className="contacto-form-section">
        <div className="contacto-container">
          <div className="form-wrapper">
            <h2 className="form-title">Envíanos un Mensaje</h2>
            
            {showSuccess && (
              <div className="success-message">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>¡Mensaje enviado con éxito! Te contactaremos pronto.</span>
              </div>
            )}

            <div className="contacto-form">
              <div className="form-row">
                <div className="form-group full">
                  <label className="form-label">
                    Nombre Completo <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu-email@ejemplo.com"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+57 XXX XXX XXXX"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label className="form-label">
                    Asunto <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    placeholder="¿Cuál es el motivo de tu consulta?"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label className="form-label">
                    Mensaje <span className="required">*</span>
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    placeholder="Cuéntanos más detalles sobre tu consulta..."
                    className="form-textarea"
                    rows="6"
                    required
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Enviar Mensaje
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section className="faq-section">
        <div className="contacto-container">
          <h2 className="section-title">Preguntas Frecuentes</h2>
          
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-card ${openFaq === index ? 'open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <h3>{faq.pregunta}</h3>
                  <svg 
                    className="faq-icon" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                <div className="faq-answer">
                  <p>{faq.respuesta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;