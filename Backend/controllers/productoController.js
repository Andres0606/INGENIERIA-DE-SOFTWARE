import supabase from '../config/supabase.js'

// Obtener productos de un emprendimiento
export const obtenerProductosEmprendimiento = async (req, res) => {
  try {
    const { idemprendimiento } = req.params;

    console.log('Buscando productos para emprendimiento:', idemprendimiento);

    const { data: productos, error } = await supabase
      .from('producto')
      .select('*')
      .eq('idemprendimiento', idemprendimiento)
      .order('idproducto');

    if (error) {
      console.log('Error al obtener productos:', error);
      throw error;
    }

    console.log('Productos encontrados:', productos);

    res.json({
      success: true,
      data: productos
    });

  } catch (error) {
    console.error('Error en obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear nuevo producto
export const crearProducto = async (req, res) => {
  try {
    const {
      idemprendimiento,
      nombre,
      descripcion,
      precio
    } = req.body;

    console.log('Creando producto:', req.body);

    // Validaciones
    if (!idemprendimiento || !nombre || !precio) {
      return res.status(400).json({
        success: false,
        message: 'idemprendimiento, nombre y precio son obligatorios'
      });
    }

    if (precio < 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio no puede ser negativo'
      });
    }

    // Verificar que el emprendimiento existe y está aprobado
    const { data: emprendimiento, error: errorEmprendimiento } = await supabase
      .from('emprendimiento')
      .select('estado')
      .eq('idemprendimiento', idemprendimiento)
      .single();

    if (errorEmprendimiento) {
      return res.status(404).json({
        success: false,
        message: 'Emprendimiento no encontrado'
      });
    }

    if (emprendimiento.estado !== 'aprobado') {
      return res.status(400).json({
        success: false,
        message: 'No se pueden agregar productos a emprendimientos no aprobados'
      });
    }

    // Crear producto
    const { data: nuevoProducto, error } = await supabase
      .from('producto')
      .insert([
        {
          idemprendimiento: parseInt(idemprendimiento),
          nombre: nombre.trim(),
          descripcion: descripcion?.trim() || null,
          precio: parseFloat(precio)
        }
      ])
      .select('*');

    if (error) {
      console.log('Error al crear producto:', error);
      throw error;
    }

    console.log('Producto creado exitosamente:', nuevoProducto[0]);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: nuevoProducto[0]
    });

  } catch (error) {
    console.error('Error en crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener todos los productos (para catálogo)
export const obtenerTodosProductos = async (req, res) => {
  try {
    const { data: productos, error } = await supabase
      .from('producto')
      .select(`
        *,
        emprendimiento:idemprendimiento (
          nombre,
          descripcion,
          estado,
          usuario:idusuario (nombres, apellidos)
        )
      `)
      .eq('emprendimiento.estado', 'aprobado')
      .order('idproducto', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: productos
    });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};