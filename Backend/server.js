import express from 'express'
import cors from 'cors'
import usuarioRoutes from './routes/usuarioRoutes.js'
import emprendimientoRoutes from './routes/emprendimientoRoutes.js'
import productoRoutes from './routes/productoRoutes.js'
import categoriaRoutes from './routes/categoriaRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(cors())

// Rutas
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/emprendimientos', emprendimientoRoutes)
app.use('/api/productos', productoRoutes)
app.use('/api/categorias', categoriaRoutes)

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Backend EmprendedoresUCC funcionando',
    endpoints: {
      usuarios: '/api/usuarios',
      emprendimientos: '/api/emprendimientos', 
      productos: '/api/productos',
      categorias: '/api/categorias'
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
  console.log(`📊 Endpoints disponibles:`)
  console.log(`   👤 Usuarios: http://localhost:${PORT}/api/usuarios`)
  console.log(`   🏢 Emprendimientos: http://localhost:${PORT}/api/emprendimientos`)
  console.log(`   🛍 Productos: http://localhost:${PORT}/api/productos`)
  console.log(`   📁 Categorías: http://localhost:${PORT}/api/categorias`)
})