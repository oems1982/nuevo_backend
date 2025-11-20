// Importar el modelo
const Empresa = require("../models/empresas.model");
const { isValidObjectId } = require("mongoose");
/**
 * POST /empresas
 * Crea una empresa (sin restricción de unicidad)
 */
const create = async (req, res) => {
  try {
    /**Extraer los datos del body */
    const { name, nit } = req.body;

    /**Validar que vengan los datos */
    if (!name || !nit) {
      /**Si no vienen devolver mensaje con error */
      return res.status(400).json({
        status: false,
        message: "name y nit son obligatorios",
      });
    }
    // Crea una nueva instancia del modelo empresa con los datos enviados en el cuerpo de la solicitud (req.body)
    const empresa = new Empresa(req.body);

    // Guarda el nuevo registro en la base de datos MongoDB
    await empresa.save();

    // Envía una respuesta HTTP con código 201 (Created) para indicar que el registro fue creado exitosamente.
    return res.status(201).json({
      status: true,
      message: "Empresa creada con éxito",
      data: empresa,
    });
  } catch (error) {
    console.error("Error creando empresa:", error);

    // Devuelve una respuesta HTTP con código de estado **500** indicando un error interno en el servidor.
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al crear la empresa: " + error.message,
      data: null,
    });
  }
};
/**Metodo GET */
const index = async (req, res) => {
  try {
    /** Traer todos los regisros de la tabla */
    const empresas = await Empresa.find();

    /** Validar si no hay registros */
    if (empresas.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No existen empresas registradas en la base de datos",
        data: [],
      });
    }

    /**Responder con la lista de empresas */
    return res.status(200).json({
      status: true,
      message: "Listado de empresas obtenido con éxito",
      data: empresas,
    });
  } catch (error) {
    console.log(`Error al recuperar el listado de empresas - error: ${error}`);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar el listado de empresas - error: ${error}`,
      data: [],
    });
  }
};

const show = async (req, res) => {
  try {
    /**Recuperar el id del registro a mostrar */
    const { id } = req.params;

    const empresa = await Empresa.findById(id);

    return res.status(200).json({
      status: true,
      message: "Empresa encontrada correctamente",
      data: empresa,
    });
  } catch (error) {
    console.log(`Error al recuperar la empresa - error: ${error}`);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar  la empresa - error: ${error}`,
      data: [],
    });
  }
};

/**
 * Controlador que busca una empresa por coincidencia parcial en su primer nombre.
 * // sin importar mayúsculas o minúsculas (Gabriel, Gabriela, gabriela, etc.).
 */
const showByName = async (req, res) => {
  try {
    // 1 Recuperar el parámetro de la ruta
    const { name } = req.params;

    // 2 Buscar autores cuyo nombre contenga el texto indicado (case-insensitive)
    const empresas = await Empresa.find({
      name: { $regex: name, $options: "i" },
    });

    // 3 Si no hay coincidencias, devolver 404
    if (!empresas || empresas.length === 0) {
      return res.status(404).json({
        status: false,
        message: `No se encontraron empresas que coincidan con: ${name}`,
        data: [],
      });
    }

    // 4 Devolver los autores encontrados
    return res.status(200).json({
      status: true,
      message: "Empresas encontradas correctamente",
      data: empresas,
    });
  } catch (error) {
    console.error("Error al recuperar la empresa:", error);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar las empresas: ${error.message}`,
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
    const empresa = await Empresa.findById(id);

    /**Validar si existe el id */
    if (!empresa) {
      return res.status(404).json({
        status: false,
        message: `El id proporcionado: ${id}. no existe en la base de datos`,
        data: [],
      });
    }

    /** Si existe actualizamos el registro con los datos recibidos en el body */
    empresa.set(req.body);
    await empresa.save();

    return res.status(200).json({
      status: true,
      message: "Empresa actualizada de forma correcta",
      data: empresa,
    });
  } catch (error) {
    console.error("Error actualizando empresa:", error);
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al actualizar la empresa: " + error.message,
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
    const deletedEmpresa = await Empresa.findByIdAndDelete(id);
    if (!deletedEmpresa) {
      return res.status(404).json({
        status: false,
        message: `No existe una empresa con el id: ${id}`,
      });
    }

    /**enviar mensaje de registro eliminado */
    return res.status(200).json({
      status: true,
      message: "Empresa eliminada correctamente de la base de datos",
      data: deletedEmpresa,
    });
  } catch (error) {
    console.error("Error eliminando empresa:", error);
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al elimunar la empresa: " + error.message,
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
