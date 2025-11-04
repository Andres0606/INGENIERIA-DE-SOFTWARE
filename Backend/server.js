import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import usuarioRoutes from './routes/usuarioRoutes.js'
import emprendimientoRoutes from './routes/emprendimientoRoutes.js'
import productoRoutes from './routes/productoRoutes.js'
import categoriaRoutes from './routes/categoriaRoutes.js'
import favoritoRoutes from './routes/favoritoRoutes.js'
import transaccionRoutes from './routes/transaccionRoutes.js'

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
app.use('/api/favoritos', favoritoRoutes)
app.use('/api/transacciones', transaccionRoutes)

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Backend EmprendedoresUCC funcionando',
    version: '1.0.0',
    endpoints: {
      usuarios: {
        registro: 'POST /api/usuarios/registro',
        login: 'POST /api/usuarios/login',
        tiposUsuario: 'GET /api/usuarios/tipos-usuario',
        carreras: 'GET /api/usuarios/carreras',
        actualizar: 'PUT /api/usuarios/actualizar'
      },
      emprendimientos: {
        todos: 'GET /api/emprendimientos',
        porUsuario: 'GET /api/emprendimientos/usuario/:idusuario',
        crear: 'POST /api/emprendimientos',
        actualizarEstado: 'PUT /api/emprendimientos/:id/estado',
        emprendedores: 'GET /api/emprendimientos/emprendedores'
      },
      productos: {
        todos: 'GET /api/productos',
        porEmprendimiento: 'GET /api/productos/emprendimiento/:idemprendimiento',
        crear: 'POST /api/productos'
      },
      categorias: {
        todas: 'GET /api/categorias',
        crear: 'POST /api/categorias'
      },
      favoritos: {
        agregar: 'POST /api/favoritos/agregar',
        eliminar: 'POST /api/favoritos/eliminar',
        porUsuario: 'GET /api/favoritos/usuario/:idusuario',
        verificar: 'GET /api/favoritos/verificar/:idusuario/:idproducto'
      }
    }
  })
})

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  })
})

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('Error global:', error)
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📊 Endpoints disponibles:`)
  console.log(`   👤 Usuarios: http://localhost:${PORT}/api/usuarios`)
  console.log(`   🏢 Emprendimientos: http://localhost:${PORT}/api/emprendimientos`)
  console.log(`   🛍 Productos: http://localhost:${PORT}/api/productos`)
  console.log(`   📁 Categorías: http://localhost:${PORT}/api/categorias`)
  console.log(`   ❤️  Favoritos: http://localhost:${PORT}/api/favoritos`)
  console.log(`   🩺 Health: http://localhost:${PORT}/health`)
  console.log(`\n💡 Prueba la ruta principal: http://localhost:${PORT}`)
})