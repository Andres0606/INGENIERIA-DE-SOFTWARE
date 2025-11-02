import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./App/Interfaces/Inicio";

function App() {
  return (
    <BrowserRouter>
      <Inicio/>
      <Routes>
        {/* Tus rutas aquí */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;