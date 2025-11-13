// Importar el modelo
const User = require("../models/users.model");
/**Para validar el id de mongodb */
const { isValidObjectId } = require("mongoose");
/**Herramienta para encriptar */
const bcrypt = require("bcryptjs");
/**Importar la función que genera el token */
const { generateJWT } = require("../helpers/jwt.helper");

/**
 * POST /users
 * Crea un usuario
 */
const create = async (req, res) => {
  try {
    /**Extraer los datos del body */
    const { first_name, last_name, email, password } = req.body;

    /**Validar que vengan los datos */
    if (!first_name || !last_name || !email || !password) {
      /**Si no vienen devolver mensaje con error */
      return res.status(400).json({
        status: false,
        message: "first_name, last_name, email, password son obligatorios",
      });
    }

    /**Encriptar el password */
    const salt = bcrypt.genSaltSync();
    req.body.password = bcrypt.hashSync(password, salt);

    // Crea una nueva instancia del modelo User con los datos enviados en el cuerpo de la solicitud (req.body)
    const user = new User(req.body);

    // Guarda el nuevo registro en la base de datos MongoDB
    await user.save();

    // Envía una respuesta HTTP con código 201 (Created) para indicar que el registro fue creado exitosamente.
    return res.status(201).json({
      status: true,
      message: "Usuario creado con éxito",
      data: user,
    });
  } catch (error) {
    console.error("Error creando usuario:", error);

    // Devuelve una respuesta HTTP con código de estado **500** indicando un error interno en el servidor.
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al crear el usuario: " + error.message,
      data: null,
    });
  }
};
/**Metodo GET */
const index = async (req, res) => {
  try {
    /** Traer todos los regisros de la tabla */
    const users = await User.find();

    /** Validar si no hay registros */
    if (users.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No existen usuarios registrados en la base de datos",
        data: [],
      });
    }

    /**Responder con la lista de usuarioes */
    return res.status(200).json({
      status: true,
      message: "Listado de usuarios obtenido con éxito",
      data: users,
    });
  } catch (error) {
    console.log(`Error al recuperar el listado de usuarios - error: ${error}`);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar el listado de usuarios - error: ${error}`,
      data: [],
    });
  }
};

const show = async (req, res) => {
  try {
    /**Recuperar el id del registro a mostrar */
    const { id } = req.params;

    const user = await User.findById(id);

    return res.status(200).json({
      status: true,
      message: "Usuario encontrado de forma correcta",
      data: user,
    });
  } catch (error) {
    console.log(`Error al recuperar el usuario - error: ${error}`);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar  el usuario - error: ${error}`,
      data: [],
    });
  }
};

/**
 * Controlador que busca un usuario por coincidencia parcial en su primer nombre.
 * // sin importar mayúsculas o minúsculas (Gabriel, Gabriela, gabriela, etc.).
 */
const showByName = async (req, res) => {
  try {
    // 1 Recuperar el parámetro de la ruta
    const { first_name } = req.params;

    // 2 Buscar usuarioes cuyo nombre contenga el texto indicado (case-insensitive)
    const users = await User.find({
      first_name: { $regex: first_name, $options: "i" },
    });

    // 3 Si no hay coincidencias, devolver 404
    if (!users || users.length === 0) {
      return res.status(404).json({
        status: false,
        message: `No se encontraron usuarios que coincidan con: ${first_name}`,
        data: [],
      });
    }

    // 4 Devolver los usuarioes encontrados
    return res.status(200).json({
      status: true,
      message: "Usuarios encontrados correctamente",
      data: users,
    });
  } catch (error) {
    console.error("Error al recuperar el usuario:", error);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar los usuarios: ${error.message}`,
      data: [],
    });
  }
};

const update = async (req, res) => {
  try {
    const { password } = req.body;

    /**Recuperar el id del registro a actualizar */
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: false,
        message: "El id proporcionado no es válido",
      });
    }

    /**Buscar el registro a modificar por el id */
    const user = await User.findById(id);

    /**Validar si existe el id */
    if (!user) {
      return res.status(404).json({
        status: false,
        message: `El usuario con id proporcionado: ${id}. no existe en la base de datos`,
        data: [],
      });
    }

    /**Encriptar el password */
    const salt = bcrypt.genSaltSync();
    req.body.password = bcrypt.hashSync(password, salt);

    /** Si existe actualizamos el registro con los datos recibidos en el body */
    user.set(req.body);
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Usuario actualizado de forma correcta",
      data: user,
    });
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al actualizar el usuario: " + error.message,
    });
  }
};

const destroy = async (req, res) => {
  try {
    /**Recuperar el id del registro a eliminar */
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: false,
        message: "El id proporcionado no es válido",
      });
    }

    /**Buscar el registro por su id y eliminarlo*/
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        status: false,
        message: `No existe un usuario con el id: ${id}`,
      });
    }

    /**enviar mensaje de registro eliminado */
    return res.status(200).json({
      status: true,
      message: "Usuario eliminado correctamente de la base de datos",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al eliminar el usuario: " + error.message,
    });
  }
};
/**Función para loguaar usuarios */
const login = async (req, res) => {
  try {
    //------------------
    //-- Recuperar los valores enviados en el body
    //------------------
    const { email, password } = req.body;

    /**Buscar el usuario */
    const userExist = await User.findOne({
      email: email,
    });
    if (!userExist) {
      return res.status(400).json({
        status: false,
        msg: "El usuario ingresado no es válido.",
      });
    }
    //-------------------
    //-- Verificar la contraseña del usuario
    //-------------------
    const validPassword = bcrypt.compareSync(password, userExist.password);
    if (!validPassword) {
      return res.status(400).json({
        status: false,
        msg: "El password ingresado no es válido.",
      });
    }

    //-------------------
    //-- Generar el token de usuario
    //-------------------
    const token = await generateJWT(userExist._id);

    //-------------------
    //-- Retornar la información del usuario y las páginas
    //-------------------
    res.status(200).json({
      status: true,
      msg: "Usuario logueado con éxito.",
      token: token,
      user: userExist,
    });
  } catch (error) {
    console.error("Error en inicio de sesión:", error);
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al iniciar sesión: " + error.message,
    });
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
  showByName,
  login,
};
