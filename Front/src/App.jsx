import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./App/Header-footer/Header";
import Footer from "./App/Header-footer/Footer";

// Interfaces principales
import Inicio from "./App/Interfaces/Inicio";
import Emprendedores from "./App/Interfaces/Emprendedores";
import Productos from "./App/Interfaces/Productos";
import Eventos from "./App/Interfaces/Eventos";
import Contactos from "./App/Interfaces/Contactos"; // ✅ plural correcto
import Login from "./App/Login/Login"; // ✅ login
import Register from "./App/Login/Register"; // ✅ registro
import Profile from "./App/Interfaces/Profile"; // ✅ perfil

function App() {
  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/emprendedores" element={<Emprendedores />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/contactos" element={<Contactos />} />
        <Route path="/login" element={<Login />} /> {/* ✅ Login */}
        <Route path="/register" element={<Register />} /> {/* ✅ Registro */}
        <Route path="/perfil" element={<Profile />} />
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;
