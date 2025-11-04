import express from 'express'
import { 
  realizarCompra, 
  recargarSaldo, 
  obtenerHistorial 
} from '../controllers/transaccionController.js'

const router = express.Router()

// Rutas de transacciones
router.post('/comprar', realizarCompra)
router.post('/recargar', recargarSaldo)
router.get('/historial/:idusuario', obtenerHistorial)

export default router