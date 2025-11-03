import express from 'express'
import { 
  obtenerEmprendimientosUsuario, 
  crearEmprendimiento,
  obtenerTodosEmprendimientos,
  actualizarEstadoEmprendimiento
} from '../controllers/emprendimientoController.js'

const router = express.Router()

// Rutas de emprendimientos
router.get('/usuario/:idusuario', obtenerEmprendimientosUsuario)
router.post('/', crearEmprendimiento)
router.get('/', obtenerTodosEmprendimientos) // Para administradores
router.put('/:idemprendimiento/estado', actualizarEstadoEmprendimiento)

export default router