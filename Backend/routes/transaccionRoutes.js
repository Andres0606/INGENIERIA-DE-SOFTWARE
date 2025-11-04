import express from 'express'
import { 
  realizarCompra, 
  recargarSaldo, 
  obtenerHistorial,
  obtenerHistorialVentas,  // 👈 Nueva
  obtenerHistorialCompras
} from '../controllers/transaccionController.js'

const router = express.Router()

// Rutas de transacciones
router.post('/comprar', realizarCompra)
router.post('/recargar', recargarSaldo)
router.get('/historial/:idusuario', obtenerHistorial)
router.get('/ventas/:idvendedor', obtenerHistorialVentas) // 👈 Nueva
router.get('/compras/:idcomprador', obtenerHistorialCompras)

export default router