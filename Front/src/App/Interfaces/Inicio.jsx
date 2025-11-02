import React from 'react';
import '../../Components/Inicio.css';
import Header from '../Header-footer/Header.jsx';
import Footer from '../Header-footer/Footer.jsx';


const Main = () => {
  return (
    <>
    <Header />
    <main className="main">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenido a Emprende UCC</h1>
          <p className="hero-description">
            Conecta con emprendedores, descubre productos innovadores y sé parte de una
            comunidad de innovadores de la Universidad Cooperativa de Colombia.
          </p>
          <button className="hero-button">Comienza Ahora</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        {/* Emprendedores Card */}
        <div className="feature-card card-green">
          <div className="feature-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3 className="feature-title">Emprendedores</h3>
          <p className="feature-description">
            Descubre y conecta con emprendedores innovadores de la comunidad UCC.
          </p>
        </div>

        {/* Productos Card */}
        <div className="feature-card card-blue">
          <div className="feature-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h3 className="feature-title">Productos</h3>
          <p className="feature-description">
            Explora una variedad de productos y servicios creados por nuestros emprendedores.
          </p>
        </div>

        {/* Eventos Card */}
        <div className="feature-card card-purple">
          <div className="feature-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h3 className="feature-title">Eventos</h3>
          <p className="feature-description">
            Participa en ferias, talleres y actividades de networking exclusivas.
          </p>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
};

export default Main;