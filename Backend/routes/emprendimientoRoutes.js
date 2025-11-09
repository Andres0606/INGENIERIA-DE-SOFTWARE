import express from 'express'
import { 
  obtenerEmprendimientosUsuario, 
  crearEmprendimiento,
  obtenerTodosEmprendimientos,
  actualizarEstadoEmprendimiento,
  obtenerEmprendedores,
  editarEmprendimiento,
  eliminarEmprendimiento,
  eliminarEmprendimientoAdmin
} from '../controllers/emprendimientoController.js'

const router = express.Router()

// Rutas de emprendimientos
router.get('/usuario/:idusuario', obtenerEmprendimientosUsuario)
router.post('/', crearEmprendimiento)
router.get('/', obtenerTodosEmprendimientos) // Para administradores
router.put('/:idemprendimiento/estado', actualizarEstadoEmprendimiento)
router.get('/emprendedores', obtenerEmprendedores)
router.put('/:idemprendimiento', editarEmprendimiento)
router.delete('/:idemprendimiento', eliminarEmprendimiento)
// Ruta para que el admin elimine emprendimientos (con eliminación en cascada)
router.delete('/admin/:idemprendimiento', eliminarEmprendimientoAdmin);

export default router