import express from 'express'
import { 
  registrarUsuario, 
  obtenerTiposUsuario, 
  obtenerCarreras,
  loginUsuario,
  actualizarPerfil  // 👈 Agrega esta importación
} from '../controllers/usuarioController.js'

const router = express.Router()

// Rutas de usuarios
router.post('/registro', registrarUsuario)
router.post('/login', loginUsuario)  // 👈 Agrega esta ruta
router.get('/tipos-usuario', obtenerTiposUsuario)
router.get('/carreras', obtenerCarreras)
router.put('/actualizar', actualizarPerfil) 

export default router