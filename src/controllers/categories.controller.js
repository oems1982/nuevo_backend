// Importar el modelo
const Category = require("../models/categories.model");

/**
 * POST /categories
 * Crea una categoría (sin restricción de unicidad)
 */
const create = async (req, res) => {
  try {
    /**Extraer los datos del body */
    const { name, description, image } = req.body;

    /**Validar que vengan los datos */
    if (!name || !description || !image ) {
      /**Si no vienen devolver mensaje con error */
      return res.status(400).json({
        status: false,
        message: "name, description e image son obligatorios",
      });
    }
    // Crea una nueva instancia del modelo Category con los datos enviados en el cuerpo de la solicitud (req.body)
    const category = new Category(req.body);

    // Guarda el nuevo registro en la base de datos MongoDB
    await category.save();

    // Envía una respuesta HTTP con código 201 (Created) para indicar que el registro fue creada exitosamente.
    return res.status(201).json({
      status: true,
      message: "Categoría creada con éxito",
      data: category,
    });
  } catch (error) {
    console.error("Error creando categoría:", error);

    // Devuelve una respuesta HTTP con código de estado **500** indicando un error interno en el servidor.
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al crear la categoría: " + error.message,
      data: null,
    });
  }
};
/**Metodo GET */
const index = async (req, res) => {

try {
  /** Traer todos los regisros de la tabla */
  const categories = await Category.find();

  /** Validar si no hay registros */
  if (categories.length === 0){
      return res.status(200).json({
        status: true,
        message: "No existen categorías registradas en la base de datos",
        data: [],
      });
  }

  /**Responder con la lista de categorías */
      return res.status(200).json({
      status: true,
      message: "Listado de categorías obtenido con éxito",
      data: categories,
    });

} catch (error) {
  console.log(`Error al recuperar el listado de categorías - error: ${error}`);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar el listado de categorías - error: ${error}`,
      data: [],
    });
}

};

const show = async (req, res) => {

try {
  /**Recuperar el id del registro a mostrar */
  const { id } = req.params;

  const category = await Category.findById(id);

 return res.status(200).json({
    status: true,
    message: "Categoría encontrado correcta",
    data: category,
  });
  
} catch (error) {
  console.log(`Error al recuperar la categoría - error: ${error}`);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar  la categoría - error: ${error}`,
      data: [],
    });
}



 
};


/**
 * Controlador que busca una categoría por coincidencia parcial en su primer nombre.
 * // sin importar mayúsculas o minúsculas (Gabriel, Gabriela, gabriela, etc.).
 */
const showByName = async (req, res) => {
  try {
    // 1 Recuperar el parámetro de la ruta
    const { name } = req.params;

    // 2 Buscar categorías cuyo nombre contenga el texto indicado (case-insensitive)
    const categories = await Category.find({
      name: { $regex: name, $options: "i" },
    });

    // 3 Si no hay coincidencias, devolver 404
    if (!categories || categories.length === 0) {
      return res.status(404).json({
        status: false,
        message: `No se encontraron categorías que coincidan con: ${name}`,
        data: [],
      });
    }

    // 4 Devolver las categorías encontradas
    return res.status(200).json({
      status: true,
      message: "Categorías encontradas correctamente",
      data: categories,
    });

  } catch (error) {
    console.error("Error al recuperar la categoría:", error);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar las categorías: ${error.message}`,
      data: [],
    });
  }
};



const update = async (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Ejecutó con exito la función update",
    data: null,
  });
};

const destroy = async (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Ejecutó con exito la función destroy",
    data: null,
  });
};
module.exports = {
  index,
  show,
  create,
  update,
  destroy,
  showByName
};
