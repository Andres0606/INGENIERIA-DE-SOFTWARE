import supabase from '../config/supabase.js'

// Obtener emprendimientos de un usuario
export const obtenerEmprendimientosUsuario = async (req, res) => {
  try {
    const { idusuario } = req.params;

    console.log('Buscando emprendimientos para usuario:', idusuario);

    const { data: emprendimientos, error } = await supabase
      .from('emprendimiento')
      .select('*')
      .eq('idusuario', idusuario)
      .order('fecharegistro', { ascending: false });

    if (error) {
      console.log('Error al obtener emprendimientos:', error);
      throw error;
    }

    console.log('Emprendimientos encontrados:', emprendimientos);

    res.json({
      success: true,
      data: emprendimientos
    });

  } catch (error) {
    console.error('Error en obtener emprendimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear nuevo emprendimiento
export const crearEmprendimiento = async (req, res) => {
  try {
    const {
      idusuario,
      idcategoria,
      nombre,
      descripcion
    } = req.body;

    console.log('Creando emprendimiento:', req.body);

    // Validaciones
    if (!idusuario || !idcategoria || !nombre) {
      return res.status(400).json({
        success: false,
        message: 'idusuario, idcategoria y nombre son obligatorios'
      });
    }

    // Verificar si el nombre ya existe
    const { data: emprendimientoExistente, error: errorVerificacion } = await supabase
      .from('emprendimiento')
      .select('idemprendimiento')
      .eq('nombre', nombre)
      .single();

    if (emprendimientoExistente) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un emprendimiento con ese nombre'
      });
    }

    if (errorVerificacion && errorVerificacion.code !== 'PGRST116') {
      console.log('Error al verificar nombre:', errorVerificacion);
      throw errorVerificacion;
    }

    // Crear emprendimiento
    const { data: nuevoEmprendimiento, error } = await supabase
      .from('emprendimiento')
      .insert([
        {
          idusuario: parseInt(idusuario),
          idcategoria: parseInt(idcategoria),
          nombre: nombre.trim(),
          descripcion: descripcion?.trim() || null,
          estado: 'pendiente'
        }
      ])
      .select('*');

    if (error) {
      console.log('Error al crear emprendimiento:', error);
      throw error;
    }

    console.log('Emprendimiento creado exitosamente:', nuevoEmprendimiento[0]);

    res.status(201).json({
      success: true,
      message: 'Emprendimiento creado exitosamente. Está pendiente de aprobación.',
      data: nuevoEmprendimiento[0]
    });

  } catch (error) {
    console.error('Error en crear emprendimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener todos los emprendimientos (para administradores)
export const obtenerTodosEmprendimientos = async (req, res) => {
  try {
    const { data: emprendimientos, error } = await supabase
      .from('emprendimiento')
      .select(`
        *,
        usuario:idusuario (nombres, apellidos, correo),
        categoria:idcategoria (nombre)
      `)
      .order('fecharegistro', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: emprendimientos
    });

  } catch (error) {
    console.error('Error al obtener emprendimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener emprendimientos',
      error: error.message
    });
  }
};
// Actualizar estado de emprendimiento
export const actualizarEstadoEmprendimiento = async (req, res) => {
  try {
    const { idemprendimiento } = req.params;
    const { estado, motivo } = req.body;

    console.log('Actualizando estado:', { idemprendimiento, estado, motivo });

    // Validaciones
    if (!estado || !['pendiente', 'aprobado', 'rechazado'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Debe ser: pendiente, aprobado o rechazado'
      });
    }

    // Actualizar estado
    const { data: emprendimientoActualizado, error } = await supabase
      .from('emprendimiento')
      .update({ estado })
      .eq('idemprendimiento', idemprendimiento)
      .select('*');

    if (error) {
      console.log('Error al actualizar estado:', error);
      throw error;
    }

    if (!emprendimientoActualizado || emprendimientoActualizado.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Emprendimiento no encontrado'
      });
    }

    console.log('Estado actualizado exitosamente:', emprendimientoActualizado[0]);

    res.json({
      success: true,
      message: `Emprendimiento ${estado} exitosamente`,
      data: emprendimientoActualizado[0]
    });

  } catch (error) {
    console.error('Error en actualizar estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
export const obtenerEmprendedores = async (req, res) => {
  try {
    console.log('Obteniendo lista de emprendedores...');

    const { data: emprendimientos, error } = await supabase
      .from('emprendimiento')
      .select(`
        *,
        usuario:idusuario (
          nombres,
          apellidos,
          correo,
          telefono,
          carrera:idcarrera (nombre)
        ),
        categoria:idcategoria (
          nombre
        )
      `)
      .eq('estado', 'aprobado')
      .order('fecharegistro', { ascending: false });

    if (error) {
      console.log('Error al obtener emprendedores:', error);
      throw error;
    }

    console.log(`Encontrados ${emprendimientos.length} emprendimientos aprobados`);

    res.json({
      success: true,
      data: emprendimientos
    });

  } catch (error) {
    console.error('Error en obtener emprendedores:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
// Editar emprendimiento
export const editarEmprendimiento = async (req, res) => {
  try {
    const { idemprendimiento } = req.params;
    const {
      nombre,
      descripcion,
      idcategoria
    } = req.body;

    console.log('Editando emprendimiento:', { idemprendimiento, ...req.body });

    // Validaciones
    if (!nombre || !idcategoria) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y categoría son obligatorios'
      });
    }

    // Verificar que el emprendimiento existe
    const { data: emprendimientoExistente, error: errorVerificacion } = await supabase
      .from('emprendimiento')
      .select('*')
      .eq('idemprendimiento', idemprendimiento)
      .single();

    if (errorVerificacion || !emprendimientoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Emprendimiento no encontrado'
      });
    }

    // Verificar si el nuevo nombre ya existe (excluyendo el actual)
    const { data: nombreExistente, error: errorNombre } = await supabase
      .from('emprendimiento')
      .select('idemprendimiento')
      .eq('nombre', nombre)
      .neq('idemprendimiento', idemprendimiento)
      .single();

    if (nombreExistente) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe otro emprendimiento con ese nombre'
      });
    }

    // Actualizar emprendimiento
    const { data: emprendimientoActualizado, error } = await supabase
      .from('emprendimiento')
      .update({
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
        idcategoria: parseInt(idcategoria)
      })
      .eq('idemprendimiento', idemprendimiento)
      .select('*');

    if (error) {
      console.log('Error al editar emprendimiento:', error);
      throw error;
    }

    console.log('Emprendimiento editado exitosamente:', emprendimientoActualizado[0]);

    res.json({
      success: true,
      message: 'Emprendimiento actualizado exitosamente',
      data: emprendimientoActualizado[0]
    });

  } catch (error) {
    console.error('Error en editar emprendimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
// Eliminar emprendimiento
export const eliminarEmprendimiento = async (req, res) => {
  try {
    const { idemprendimiento } = req.params;

    console.log('Eliminando emprendimiento:', idemprendimiento);

    // Verificar que el emprendimiento existe
    const { data: emprendimiento, error: errorVerificacion } = await supabase
      .from('emprendimiento')
      .select('*')
      .eq('idemprendimiento', idemprendimiento)
      .single();

    if (errorVerificacion || !emprendimiento) {
      return res.status(404).json({
        success: false,
        message: 'Emprendimiento no encontrado'
      });
    }

    // Verificar si tiene productos
    const { data: productos, error: errorProductos } = await supabase
      .from('producto')
      .select('idproducto')
      .eq('idemprendimiento', idemprendimiento);

    if (errorProductos) throw errorProductos;

    if (productos && productos.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar un emprendimiento que tiene productos. Elimina los productos primero.'
      });
    }

    // Eliminar emprendimiento
    const { error } = await supabase
      .from('emprendimiento')
      .delete()
      .eq('idemprendimiento', idemprendimiento);

    if (error) throw error;

    console.log('Emprendimiento eliminado exitosamente');

    res.json({
      success: true,
      message: 'Emprendimiento eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error en eliminar emprendimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
// Eliminar emprendimiento (admin - con eliminación en cascada)
// Eliminar emprendimiento (admin - versión segura con manejo de errores)
export const eliminarEmprendimientoAdmin = async (req, res) => {
  try {
    const { idemprendimiento } = req.params;

    console.log('Admin eliminando emprendimiento:', idemprendimiento);

    // Verificar que el emprendimiento existe
    const { data: emprendimiento, error: errorVerificacion } = await supabase
      .from('emprendimiento')
      .select('*')
      .eq('idemprendimiento', idemprendimiento)
      .single();

    if (errorVerificacion || !emprendimiento) {
      return res.status(404).json({
        success: false,
        message: 'Emprendimiento no encontrado'
      });
    }

    // Obtener todos los productos primero
    const { data: productos, error: errorObtenerProductos } = await supabase
      .from('producto')
      .select('idproducto')
      .eq('idemprendimiento', idemprendimiento);

    if (errorObtenerProductos) throw errorObtenerProductos;

    const productosIds = productos?.map(p => p.idproducto) || [];

    console.log(`Encontrados ${productosIds.length} productos para eliminar`);

    // Función para eliminar de una tabla de manera segura
    const eliminarDeTabla = async (tabla, campo, valores, nombreTabla) => {
      if (!valores || valores.length === 0) {
        console.log(`⏭️  No hay datos para eliminar de ${nombreTabla}`);
        return;
      }

      try {
        const { error } = await supabase
          .from(tabla)
          .delete()
          .in(campo, valores);

        if (error) {
          // Si es error de foreign key, intentamos eliminar uno por uno
          if (error.code === '23503') {
            console.log(`⚠️  Error de FK en ${nombreTabla}, eliminando uno por uno...`);
            
            for (const valor of valores) {
              const { error: errorIndividual } = await supabase
                .from(tabla)
                .delete()
                .eq(campo, valor);

              if (errorIndividual) {
                console.log(`❌ Error eliminando ${nombreTabla} para ${campo}=${valor}:`, errorIndividual.message);
              }
            }
          } else {
            throw error;
          }
        } else {
          console.log(`✅ ${nombreTabla} eliminado`);
        }
      } catch (error) {
        console.log(`⚠️  Error no crítico en ${nombreTabla}:`, error.message);
      }
    };

    // ELIMINAR EN ORDEN CORRECTO

    // 1. Eliminar favoritos de productos
    await eliminarDeTabla('favorito_producto', 'idproducto', productosIds, 'favorito_producto');

    // 2. Eliminar calificaciones
    await eliminarDeTabla('calificacion', 'idproducto', productosIds, 'calificacion');

    // 3. Eliminar transacciones
    await eliminarDeTabla('transaccion', 'idproducto', productosIds, 'transaccion');

    // 4. Eliminar productos
    await eliminarDeTabla('producto', 'idemprendimiento', [idemprendimiento], 'producto');

    // 5. Eliminar favoritos del emprendimiento
    await eliminarDeTabla('favorito', 'idemprendimiento', [idemprendimiento], 'favorito');

    // 6. Eliminar seguimientos
    await eliminarDeTabla('seguimiento', 'idemprendimiento', [idemprendimiento], 'seguimiento');

    // 7. Finalmente eliminar el emprendimiento
    const { error: errorFinal } = await supabase
      .from('emprendimiento')
      .delete()
      .eq('idemprendimiento', idemprendimiento);

    if (errorFinal) throw errorFinal;

    console.log('🎉 Emprendimiento eliminado completamente');

    res.json({
      success: true,
      message: 'Emprendimiento eliminado exitosamente con todos sus datos asociados',
      detalles: {
        productosEliminados: productosIds.length
      }
    });

  } catch (error) {
    console.error('Error crítico eliminando emprendimiento:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudo eliminar el emprendimiento completamente',
      error: error.message,
      sugerencia: 'El emprendimiento puede tener transacciones activas que no se pueden eliminar'
    });
  }
};