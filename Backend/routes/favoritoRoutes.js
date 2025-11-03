import express from 'express'
import { 
  agregarFavorito, 
  eliminarFavorito, 
  obtenerFavoritosUsuario,
  verificarFavorito 
} from '../controllers/favoritoController.js'

const router = express.Router()

// Rutas de favoritos
router.post('/agregar', agregarFavorito)
router.post('/eliminar', eliminarFavorito)
router.get('/usuario/:idusuario', obtenerFavoritosUsuario)
router.get('/verificar/:idusuario/:idproducto', verificarFavorito)

export default router