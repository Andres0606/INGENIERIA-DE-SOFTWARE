import supabase from '../config/supabase.js'

// Realizar compra de producto
export const realizarCompra = async (req, res) => {
  try {
    const { idcomprador, idproducto, cantidad = 1 } = req.body;

    console.log('Procesando compra:', { idcomprador, idproducto, cantidad });

    // Validaciones
    if (!idcomprador || !idproducto) {
      return res.status(400).json({
        success: false,
        message: 'idcomprador e idproducto son obligatorios'
      });
    }

    if (cantidad < 1) {
      return res.status(400).json({
        success: false,
        message: 'La cantidad debe ser al menos 1'
      });
    }

    // Obtener información del producto y vendedor
    const { data: producto, error: errorProducto } = await supabase
      .from('producto')
      .select(`
        *,
        emprendimiento:idemprendimiento (
          idusuario,
          nombre
        )
      `)
      .eq('idproducto', idproducto)
      .single();

    if (errorProducto || !producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const idvendedor = producto.emprendimiento.idusuario;

    // Verificar que no sea el mismo usuario
    if (parseInt(idcomprador) === parseInt(idvendedor)) {
      return res.status(400).json({
        success: false,
        message: 'No puedes comprar tus propios productos'
      });
    }

    // Verificar stock disponible
    if (producto.stock < cantidad) {
      return res.status(400).json({
        success: false,
        message: `Stock insuficiente. Solo quedan ${producto.stock} unidades`
      });
    }

    // Calcular monto total
    const montoTotal = producto.precio * cantidad;

    // Verificar saldo del comprador
    const { data: comprador, error: errorComprador } = await supabase
      .from('usuario')
      .select('saldo, nombres, apellidos')
      .eq('idusuario', idcomprador)
      .single();

    if (errorComprador) {
      return res.status(404).json({
        success: false,
        message: 'Comprador no encontrado'
      });
    }

    if (comprador.saldo < montoTotal) {
      return res.status(400).json({
        success: false,
        message: `Saldo insuficiente. Necesitas $${montoTotal}, tienes $${comprador.saldo}`
      });
    }

    // INICIAR TRANSACCIÓN EN LA BASE DE DATOS
    // 1. Actualizar stock del producto
    const { error: errorStock } = await supabase
      .from('producto')
      .update({ stock: producto.stock - cantidad })
      .eq('idproducto', idproducto);

    if (errorStock) throw errorStock;

    // 2. Descontar saldo del comprador
    const { error: errorCompradorUpdate } = await supabase
      .from('usuario')
      .update({ saldo: comprador.saldo - montoTotal })
      .eq('idusuario', idcomprador);

    if (errorCompradorUpdate) throw errorCompradorUpdate;

    // 3. Aumentar saldo del vendedor
    const { data: vendedor, error: errorVendedor } = await supabase
      .from('usuario')
      .select('saldo')
      .eq('idusuario', idvendedor)
      .single();

    if (errorVendedor) throw errorVendedor;

    const { error: errorVendedorUpdate } = await supabase
      .from('usuario')
      .update({ saldo: (vendedor.saldo || 0) + montoTotal })
      .eq('idusuario', idvendedor);

    if (errorVendedorUpdate) throw errorVendedorUpdate;

    // 4. Registrar la transacción
    const { data: nuevaTransaccion, error: errorTransaccion } = await supabase
      .from('transaccion')
      .insert([
        {
          idcomprador: parseInt(idcomprador),
          idvendedor: parseInt(idvendedor),
          idproducto: parseInt(idproducto),
          cantidad: parseInt(cantidad),
          monto_total: montoTotal,
          estado: 'completada'
        }
      ])
      .select(`
        *,
        comprador:idcomprador (nombres, apellidos),
        vendedor:idvendedor (nombres, apellidos),
        producto:idproducto (nombre, precio)
      `);

    if (errorTransaccion) throw errorTransaccion;

    console.log('Compra realizada exitosamente:', nuevaTransaccion[0]);

    res.json({
      success: true,
      message: `¡Compra realizada exitosamente! Has comprado ${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'} de ${producto.nombre}`,
      data: {
        transaccion: nuevaTransaccion[0],
        saldo_restante: comprador.saldo - montoTotal
      }
    });

  } catch (error) {
    console.error('Error en realizar compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Recargar saldo
export const recargarSaldo = async (req, res) => {
  try {
    const { idusuario, monto } = req.body;

    console.log('Recargando saldo:', { idusuario, monto });

    // Validaciones
    if (!idusuario || !monto) {
      return res.status(400).json({
        success: false,
        message: 'idusuario y monto son obligatorios'
      });
    }

    if (monto <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto debe ser mayor a 0'
      });
    }

    // Obtener saldo actual
    const { data: usuario, error: errorUsuario } = await supabase
      .from('usuario')
      .select('saldo, nombres, apellidos')
      .eq('idusuario', idusuario)
      .single();

    if (errorUsuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar saldo
    const nuevoSaldo = (usuario.saldo || 0) + parseFloat(monto);
    const { data: usuarioActualizado, error: errorUpdate } = await supabase
      .from('usuario')
      .update({ saldo: nuevoSaldo })
      .eq('idusuario', idusuario)
      .select('idusuario, nombres, apellidos, saldo');

    if (errorUpdate) throw errorUpdate;

    console.log('Saldo recargado exitosamente:', usuarioActualizado[0]);

    res.json({
      success: true,
      message: `¡Saldo recargado exitosamente! $${monto} agregados a tu cuenta`,
      data: usuarioActualizado[0]
    });

  } catch (error) {
    console.error('Error en recargar saldo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener historial de transacciones
export const obtenerHistorial = async (req, res) => {
  try {
    const { idusuario } = req.params;

    console.log('Obteniendo historial para usuario:', idusuario);

    // Obtener transacciones como comprador y vendedor
    const { data: transacciones, error } = await supabase
      .from('transaccion')
      .select(`
        *,
        comprador:idcomprador (nombres, apellidos),
        vendedor:idvendedor (nombres, apellidos),
        producto:idproducto (nombre, precio, emprendimiento:idemprendimiento(nombre))
      `)
      .or(`idcomprador.eq.${idusuario},idvendedor.eq.${idusuario}`)
      .order('fecha_transaccion', { ascending: false });

    if (error) throw error;

    console.log(`Encontradas ${transacciones.length} transacciones`);

    res.json({
      success: true,
      data: transacciones
    });

  } catch (error) {
    console.error('Error en obtener historial:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};