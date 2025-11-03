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