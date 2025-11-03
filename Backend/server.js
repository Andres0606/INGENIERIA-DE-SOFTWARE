import express from 'express'
import cors from 'cors'
import usuarioRoutes from './routes/usuarioRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(cors()) // <- Esto permite que el frontend se conecte

// Rutas
app.use('/api/usuarios', usuarioRoutes)

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Backend EmprendedoresUCC funcionando',
    endpoints: {
      registro: 'POST /api/usuarios/registro',
      tiposUsuario: 'GET /api/usuarios/tipos-usuario',
      carreras: 'GET /api/usuarios/carreras'
    }
  })
})

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`👤 Registro de usuarios: POST http://localhost:${PORT}/api/usuarios/registro`)
  console.log(`📋 Tipos de usuario: GET http://localhost:${PORT}/api/usuarios/tipos-usuario`)
  console.log(`🎓 Carreras: GET http://localhost:${PORT}/api/usuarios/carreras`)
})