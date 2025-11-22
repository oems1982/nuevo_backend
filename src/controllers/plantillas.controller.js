// Importar el modelo
const Plantilla = require("../models/plantillas.model");
const { isValidObjectId } = require("mongoose");
/**
 * POST /plantillas
 * Crea una plantilla (sin restricción de unicidad)
 */
const create = async (req, res) => {
  try {
    /**Extraer los datos del body */
    const {name } = req.body;

    /**Validar que vengan los datos */
    if (!name) {
      /**Si no vienen devolver mensaje con error */
      return res.status(400).json({
        status: false,
        message: "name es obligatorio",
      });
    }
    // Crea una nueva instancia del modelo plantillas con los datos enviados en el cuerpo de la solicitud (req.body)
    const plantilla = new Plantilla(req.body);

    // Guarda el nuevo registro en la base de datos MongoDB
    await plantilla.save();

    // Envía una respuesta HTTP con código 201 (Created) para indicar que el registro fue creado exitosamente.
    return res.status(201).json({
      status: true,
      message: "plantilla creada con éxito",
      data: plantilla,
    });
  } catch (error) {
    console.error("Error creando plantilla:", error);

    // Devuelve una respuesta HTTP con código de estado **500** indicando un error interno en el servidor.
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al crear la plantilla: " + error.message,
      data: null,
    });
  }
};
/**Metodo GET */
const index = async (req, res) => {
  try {
    /** Traer todos los regisros de la tabla */
    const plantillas = await Plantilla.find();

    /** Validar si no hay registros */
    if (plantillas.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No existen plantillas registradas en la base de datos",
        data: [],
      });
    }

    /**Responder con la lista de plantillas */
    return res.status(200).json({
      status: true,
      message: "Listado de plantillas obtenido con éxito",
      data: plantillas,
    });
  } catch (error) {
    console.log(`Error al recuperar el listado de plantillas - error: ${error}`);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar el listado de plantillas - error: ${error}`,
      data: [],
    });
  }
};

const show = async (req, res) => {
  try {
    /**Recuperar el id del registro a mostrar */
    const { id } = req.params;

    const plantilla = await Plantilla.findById(id);

    return res.status(200).json({
      status: true,
      message: "Plantilla encontrado¿a correctamente",
      data: plantilla,
    });
  } catch (error) {
    console.log(`Error al recuperar la plantilla - error: ${error}`);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar  la plantilla - error: ${error}`,
      data: [],
    });
  }
};

/**
 * Controlador que busca una plantilla por coincidencia parcial en su primer nombre.
 * // sin importar mayúsculas o minúsculas (Gabriel, Gabriela, gabriela, etc.).
 */
const showByName = async (req, res) => {
  try {
    // 1 Recuperar el parámetro de la ruta
    const { name } = req.params;

    // 2 Buscar autores cuyo nombre contenga el texto indicado (case-insensitive)
    const plantillas = await Plantilla.find({
      name: { $regex: name, $options: "i" },
    });

    // 3 Si no hay coincidencias, devolver 404
    if (!plantillas || plantillas.length === 0) {
      return res.status(404).json({
        status: false,
        message: `No se encontraron plantillas que coincidan con: ${name}`,
        data: [],
      });
    }

    // 4 Devolver las plantillas encontrados
    return res.status(200).json({
      status: true,
      message: "Plantillas encontradas correctamente",
      data: plantillas,
    });
  } catch (error) {
    console.error("Error al recuperar las plantillas:", error);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar las plantillas: ${error.message}`,
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
    const plantilla = await Plantilla.findById(id);

    /**Validar si existe el id */
    if (!plantilla) {
      return res.status(404).json({
        status: false,
        message: `El id proporcionado: ${id}. no existe en la base de datos`,
        data: [],
      });
    }

    /** Si existe actualizamos el registro con los datos recibidos en el body */
    plantilla.set(req.body);
    await plantilla.save();

    return res.status(200).json({
      status: true,
      message: "Plantilla actualizada de forma correcta",
      data: plantilla,
    });
  } catch (error) {
    console.error("Error actualizando plantilla:", error);
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al actualizar la plantilla: " + error.message,
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
    const deletedPlantilla = await Plantilla.findByIdAndDelete(id);
    if (!deletedPlantilla) {
      return res.status(404).json({
        status: false,
        message: `No existe una plantilla con el id: ${id}`,
      });
    }

    /**enviar mensaje de registro eliminado */
    return res.status(200).json({
      status: true,
      message: "Plantilla eliminada correctamente de la base de datos",
      data: deletedPlantilla,
    });
  } catch (error) {
    console.error("Error eliminando plantilla:", error);
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al elimunar la plantilla: " + error.message,
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
