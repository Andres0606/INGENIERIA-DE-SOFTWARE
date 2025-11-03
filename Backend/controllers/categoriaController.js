import supabase from '../config/supabase.js'

// Obtener todas las categorías
export const obtenerCategorias = async (req, res) => {
  try {
    const { data: categorias, error } = await supabase
      .from('categoria')
      .select('*')
      .order('nombre');

    if (error) throw error;

    res.json({
      success: true,
      data: categorias
    });

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
};

// Crear nueva categoría (solo administradores)
export const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es obligatorio'
      });
    }

    const { data: nuevaCategoria, error } = await supabase
      .from('categoria')
      .insert([{ nombre: nombre.trim() }])
      .select('*');

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: nuevaCategoria[0]
    });

  } catch (error) {
    console.error('Error en crear categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};