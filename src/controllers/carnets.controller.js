// Importar el modelo
const Carnet = require("../models/carnets.model");
const { isValidObjectId } = require("mongoose");
/**
 * POST /carnets
 * Crea un carnet (sin restricción de unicidad)
 */
const create = async (req, res) => {
  try {
    /**Extraer los datos del body */
    const { first_name, last_name, documento } = req.body;

    /**Validar que vengan los datos */
    if (!first_name || !last_name || !documento) {
      /**Si no vienen devolver mensaje con error */
      return res.status(400).json({
        status: false,
        message: "first_name, last_name y documento son obligatorios",
      });
    }
    // Crea una nueva instancia del modelo carnets con los datos enviados en el cuerpo de la solicitud (req.body)
    const carnet = new Carnet(req.body);

    // Guarda el nuevo registro en la base de datos MongoDB
    await carnet.save();

    // Envía una respuesta HTTP con código 201 (Created) para indicar que el registro fue creado exitosamente.
    return res.status(201).json({
      status: true,
      message: "Carnet creado con éxito",
      data: carnet,
    });
  } catch (error) {
    console.error("Error creando carnet:", error);

    // Devuelve una respuesta HTTP con código de estado **500** indicando un error interno en el servidor.
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al crear el carnet: " + error.message,
      data: null,
    });
  }
};
/**Metodo GET */
const index = async (req, res) => {
  try {
    /** Traer todos los regisros de la tabla */
    const carnets = await Carnet.find();

    /** Validar si no hay registros */
    if (carnets.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No existen carnets registrados en la base de datos",
        data: [],
      });
    }

    /**Responder con la lista de autores */
    return res.status(200).json({
      status: true,
      message: "Listado de carnets obtenido con éxito",
      data: carnets,
    });
  } catch (error) {
    console.log(`Error al recuperar el listado de carnets - error: ${error}`);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar el listado de carnets - error: ${error}`,
      data: [],
    });
  }
};

const show = async (req, res) => {
  try {
    /**Recuperar el id del registro a mostrar */
    const { id } = req.params;

    const carnet = await Carnet.findById(id);

    return res.status(200).json({
      status: true,
      message: "Carnet encontrado correctamente",
      data: carnet,
    });
  } catch (error) {
    console.log(`Error al recuperar el carnet - error: ${error}`);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar  el carnet - error: ${error}`,
      data: [],
    });
  }
};

/**
 * Controlador que busca un carnet por coincidencia parcial en su primer nombre.
 * // sin importar mayúsculas o minúsculas (Gabriel, Gabriela, gabriela, etc.).
 */
const showByName = async (req, res) => {
  try {
    // 1 Recuperar el parámetro de la ruta
    const { first_name } = req.params;

    // 2 Buscar carnet cuyo nombre contenga el texto indicado (case-insensitive)
    const carnets = await Carnet.find({
      first_name: { $regex: first_name, $options: "i" },
    });

    // 3 Si no hay coincidencias, devolver 404
    if (!carnets || carnets.length === 0) {
      return res.status(404).json({
        status: false,
        message: `No se encontraron carnets que coincidan con: ${first_name}`,
        data: [],
      });
    }

    // 4 Devolver los carnets encontrados
    return res.status(200).json({
      status: true,
      message: "Carnets encontrados correctamente",
      data: carnets,
    });
  } catch (error) {
    console.error("Error al recuperar los carnets:", error);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar los carnets: ${error.message}`,
      data: [],
    });
  }
};

const update = async (req, res) => {
  try {
    /**Recuperar el id del registro a actualizar */
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: false,
        message: "El id proporcionado no es válido",
      });
    }

    /**Buscar el registro a modificar por el id */
    const carnet = await Carnet.findById(id);

    /**Validar si existe el id */
    if (!carnet) {
      return res.status(404).json({
        status: false,
        message: `El id proporcionado: ${id}. no existe en la base de datos`,
        data: [],
      });
    }

    /** Si existe actualizamos el registro con los datos recibidos en el body */
    carnet.set(req.body);
    await carnet.save();

    return res.status(200).json({
      status: true,
      message: "Carnet actualizado de forma correcta",
      data: carnet,
    });
  } catch (error) {
    console.error("Error actualizando carnet:", error);
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al actualizar el carnet: " + error.message,
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
    const deletedCarnet = await Carnet.findByIdAndDelete(id);
    if (!deletedCarnet) {
      return res.status(404).json({
        status: false,
        message: `No existe un carnet con el id: ${id}`,
      });
    }

    /**enviar mensaje de registro eliminado */
    return res.status(200).json({
      status: true,
      message: "Carnet eliminado correctamente de la base de datos",
      data: deletedCarnet,
    });
  } catch (error) {
    console.error("Error eliminando carnet:", error);
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al eliminar el carnet: " + error.message,
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
};
