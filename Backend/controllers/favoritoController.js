import supabase from '../config/supabase.js'

// Agregar producto a favoritos
export const agregarFavorito = async (req, res) => {
  try {
    const { idusuario, idproducto } = req.body;

    console.log('Agregando a favoritos:', { idusuario, idproducto });

    // Validaciones
    if (!idusuario || !idproducto) {
      return res.status(400).json({
        success: false,
        message: 'idusuario e idproducto son obligatorios'
      });
    }

    // Verificar si ya existe
    const { data: favoritoExistente, error: errorVerificacion } = await supabase
      .from('favorito_producto')
      .select('*')
      .eq('idusuario', idusuario)
      .eq('idproducto', idproducto)
      .single();

    if (favoritoExistente) {
      // Si existe y está eliminado, reactivarlo
      if (favoritoExistente.estado === 'eliminado') {
        const { data: favoritoActualizado, error } = await supabase
          .from('favorito_producto')
          .update({ estado: 'activo' })
          .eq('idfavoritoproducto', favoritoExistente.idfavoritoproducto)
          .select('*');

        if (error) throw error;

        return res.json({
          success: true,
          message: 'Producto agregado a favoritos',
          data: favoritoActualizado[0]
        });
      } else {
        return res.status(409).json({
          success: false,
          message: 'El producto ya está en favoritos'
        });
      }
    }

    // Crear nuevo favorito
    const { data: nuevoFavorito, error } = await supabase
      .from('favorito_producto')
      .insert([
        {
          idusuario: parseInt(idusuario),
          idproducto: parseInt(idproducto),
          estado: 'activo'
        }
      ])
      .select(`
        *,
        producto:idproducto (
          *,
          emprendimiento:idemprendimiento (
            nombre,
            categoria:idcategoria (nombre),
            usuario:idusuario (nombres, apellidos)
          )
        )
      `);

    if (error) {
      console.log('Error al crear favorito:', error);
      throw error;
    }

    console.log('Favorito creado exitosamente:', nuevoFavorito[0]);

    res.status(201).json({
      success: true,
      message: 'Producto agregado a favoritos',
      data: nuevoFavorito[0]
    });

  } catch (error) {
    console.error('Error en agregar favorito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar producto de favoritos
export const eliminarFavorito = async (req, res) => {
  try {
    const { idusuario, idproducto } = req.body;

    console.log('Eliminando de favoritos:', { idusuario, idproducto });

    // Validaciones
    if (!idusuario || !idproducto) {
      return res.status(400).json({
        success: false,
        message: 'idusuario e idproducto son obligatorios'
      });
    }

    // Actualizar estado a eliminado
    const { data: favoritoActualizado, error } = await supabase
      .from('favorito_producto')
      .update({ estado: 'eliminado' })
      .eq('idusuario', idusuario)
      .eq('idproducto', idproducto)
      .eq('estado', 'activo')
      .select('*');

    if (error) {
      console.log('Error al eliminar favorito:', error);
      throw error;
    }

    if (!favoritoActualizado || favoritoActualizado.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Favorito no encontrado'
      });
    }

    console.log('Favorito eliminado exitosamente');

    res.json({
      success: true,
      message: 'Producto eliminado de favoritos',
      data: favoritoActualizado[0]
    });

  } catch (error) {
    console.error('Error en eliminar favorito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener favoritos de un usuario
export const obtenerFavoritosUsuario = async (req, res) => {
  try {
    const { idusuario } = req.params;

    console.log('Obteniendo favoritos para usuario:', idusuario);

    const { data: favoritos, error } = await supabase
      .from('favorito_producto')
      .select(`
        *,
        producto:idproducto (
          *,
          emprendimiento:idemprendimiento (
            nombre,
            categoria:idcategoria (nombre),
            usuario:idusuario (nombres, apellidos, correo)
          )
        )
      `)
      .eq('idusuario', idusuario)
      .eq('estado', 'activo')
      .order('fechamarcado', { ascending: false });

    if (error) {
      console.log('Error al obtener favoritos:', error);
      throw error;
    }

    console.log(`Encontrados ${favoritos.length} favoritos`);

    res.json({
      success: true,
      data: favoritos
    });

  } catch (error) {
    console.error('Error en obtener favoritos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Verificar si un producto es favorito
export const verificarFavorito = async (req, res) => {
  try {
    const { idusuario, idproducto } = req.params;

    const { data: favorito, error } = await supabase
      .from('favorito_producto')
      .select('*')
      .eq('idusuario', idusuario)
      .eq('idproducto', idproducto)
      .eq('estado', 'activo')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({
      success: true,
      data: {
        esFavorito: !!favorito,
        favorito: favorito || null
      }
    });

  } catch (error) {
    console.error('Error en verificar favorito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};