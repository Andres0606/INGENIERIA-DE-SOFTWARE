import express from 'express'
import { 
  obtenerProductosEmprendimiento, 
  crearProducto,
  obtenerTodosProductos,
  actualizarStock 
} from '../controllers/productoController.js'

const router = express.Router()

// Rutas de productos
router.get('/emprendimiento/:idemprendimiento', obtenerProductosEmprendimiento)
router.post('/', crearProducto)
router.get('/', obtenerTodosProductos) // Para catálogo público
router.put('/:idproducto/stock', actualizarStock)

export default router