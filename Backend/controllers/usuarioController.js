import supabase from '../config/supabase.js'
import bcrypt from 'bcrypt'

// Registrar nuevo usuario - CON BCRYPT
export const registrarUsuario = async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      correo,
      contrasena,
      idcarrera,
      telefono,
      idtipousuario,
      tipodocumento,
      numdocumento
    } = req.body

    console.log('Datos recibidos:', req.body);

    // Validaciones básicas
    if (!nombres || !apellidos || !correo || !contrasena || !idtipousuario) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: nombres, apellidos, correo, contraseña y tipo de usuario'
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de correo electrónico inválido'
      })
    }

    // Verificar si el correo ya existe
    const { data: usuarioExistente, error: errorVerificacion } = await supabase
      .from('usuario')
      .select('idusuario')
      .eq('correo', correo)
      .single()

    if (usuarioExistente) {
      return res.status(409).json({
        success: false,
        message: 'El correo electrónico ya está registrado'
      })
    }

    if (errorVerificacion && errorVerificacion.code !== 'PGRST116') {
      console.log('Error al verificar correo:', errorVerificacion);
      throw errorVerificacion
    }

    // 🔐 ENCRIPTAR CONTRASEÑA
    const saltRounds = 10;
    const contrasenaEncriptada = await bcrypt.hash(contrasena, saltRounds);

    // Insertar nuevo usuario CON CONTRASEÑA ENCRIPTADA
    const { data: nuevoUsuario, error: errorInsercion } = await supabase
      .from('usuario')
      .insert([
        {
          idtipousuario,
          idcarrera: idcarrera || null,
          nombres,
          apellidos,
          correo,
          contrasena: contrasenaEncriptada,
          tipodocumento: tipodocumento || null,
          numdocumento: numdocumento || null,
          telefono: telefono || null,
          estado: 'activo'
        }
      ])
      .select('idusuario, nombres, apellidos, correo, idtipousuario, idcarrera, telefono, tipodocumento, numdocumento')

    if (errorInsercion) {
      console.log('Error al insertar usuario:', errorInsercion);
      throw errorInsercion
    }

    console.log('Usuario registrado exitosamente:', nuevoUsuario);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        idusuario: nuevoUsuario[0].idusuario,
        nombres: nuevoUsuario[0].nombres,
        apellidos: nuevoUsuario[0].apellidos,
        correo: nuevoUsuario[0].correo,
        idtipousuario: nuevoUsuario[0].idtipousuario,
        idcarrera: nuevoUsuario[0].idcarrera,
        telefono: nuevoUsuario[0].telefono,
        tipodocumento: nuevoUsuario[0].tipodocumento,
        numdocumento: nuevoUsuario[0].numdocumento
      }
    })

  } catch (error) {
    console.error('Error en registro de usuario:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    })
  }
}

// Obtener tipos de usuario - AGREGAR export
export const obtenerTiposUsuario = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tipousuario')
      .select('*')
      .order('idtipousuario')

    if (error) throw error

    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error al obtener tipos de usuario:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener tipos de usuario',
      error: error.message
    })
  }
}

// Obtener carreras - AGREGAR export
export const obtenerCarreras = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('carrera')
      .select('*')
      .order('nombre')

    if (error) throw error

    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error al obtener carreras:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener carreras',
      error: error.message
    })
  }
}

// Login de usuario - CON BCRYPT
export const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Validaciones
    if (!correo || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son requeridos'
      });
    }

    // Buscar usuario por correo
    const { data: usuario, error } = await supabase
      .from('usuario')
      .select('idusuario, nombres, apellidos, correo, contrasena, idtipousuario, idcarrera, telefono, tipodocumento, numdocumento, estado')
      .eq('correo', correo)
      .eq('estado', 'activo')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      throw error;
    }

    // 🔐 VERIFICAR CONTRASEÑA ENCRIPTADA
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    
    if (!contrasenaValida) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    // Login exitoso
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        idusuario: usuario.idusuario,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        idtipousuario: usuario.idtipousuario,
        idcarrera: usuario.idcarrera,
        telefono: usuario.telefono,
        tipodocumento: usuario.tipodocumento,
        numdocumento: usuario.numdocumento
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};