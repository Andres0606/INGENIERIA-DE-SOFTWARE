import express from 'express'
import { 
  obtenerCategorias,
  crearCategoria 
} from '../controllers/categoriaController.js'

const router = express.Router()

// Rutas de categorías
router.get('/', obtenerCategorias)
router.post('/', crearCategoria) // Solo administradores

export default router