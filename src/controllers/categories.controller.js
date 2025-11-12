// Importar el modelo
const Category = require("../models/categories.model");
const { isValidObjectId } = require("mongoose");

/**
 * POST /authors
 * Crea un autor (sin restricción de unicidad)
 */
const create = async (req, res) => {
  try {
    /**Extraer los datos del body */
    const { name, description, image } = req.body;

    /**Validar que vengan los datos */
    if (!name || !description || !image) {
      /**Si no vienen devolver mensaje con error */
      return res.status(400).json({
        status: false,
        message: "name, imagen y descripcion son obligatorios",
      });
    }
    // Crea una nueva instancia del modelo Author con los datos enviados en el cuerpo de la solicitud (req.body)
    const categoria = new Category(req.body);

    // Guarda el nuevo registro en la base de datos MongoDB
    await categoria.save();

    // Envía una respuesta HTTP con código 201 (Created) para indicar que el registro fue creado exitosamente.
    return res.status(201).json({
      status: true,
      message: "Categoria creada con éxito",
      data: categoria,
    });
  } catch (error) {
    console.error("Error creando categoria:", error);

    // Devuelve una respuesta HTTP con código de estado **500** indicando un error interno en el servidor.
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al crear la categoria: " + error.message,
      data: null,
    });
  }
};
/**Metodo GET */
const index = async (req, res) => {

try {
  /** Traer todos los regisros de la tabla */
  const categorias = await Category.find();

  /** Validar si no hay registros */
  if (categorias.length === 0){
      return res.status(200).json({
        status: true,
        message: "No existen categorias registrados en la base de datos",
        data: [],
      });
  }

  /**Responder con la lista de autores */
      return res.status(200).json({
      status: true,
      message: "Listado de categorias obtenido con éxito",
      data: categorias,
    });

} catch (error) {
  console.log(`Error al recuperar el listado de categorias - error: ${error}`);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar el listado de categorias - error: ${error}`,
      data: [],
    });
}

};

const show = async (req, res) => {

try {
  /**Recuperar el id del registro a mostrar */
  const { id } = req.params;

  const categorias = await Category.findById(id);

 return res.status(200).json({
    status: true,
    message: "Categoria encontrada correctamente",
    data: categorias,
  });
  
} catch (error) {
  console.log(`Error al recuperar la categoria - error: ${error}`);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar la categoria - error: ${error}`,
      data: [],
    });
}



 
};


/**
 * Controlador que busca un autor por coincidencia parcial en su primer nombre.
 * // sin importar mayúsculas o minúsculas (Gabriel, Gabriela, gabriela, etc.).
 */
const showByName = async (req, res) => {
  try {
    // 1 Recuperar el parámetro de la ruta
    const { name } = req.params;

    // 2 Buscar autores cuyo nombre contenga el texto indicado (case-insensitive)
    const categorias = await Category.find({
      name: { $regex: name, $options: "i" },
    });

    // 3 Si no hay coincidencias, devolver 404
    if (!categorias || categorias.length === 0) {
      return res.status(404).json({
        status: false,
        message: `No se encontraron categorias que coincidan con: ${name}`,
        data: [],
      });
    }

    // 4 Devolver los autores encontrados
    return res.status(200).json({
      status: true,
      message: "Categorias encontradas",
      data: categorias,
    });

  } catch (error) {
    console.error("Error al recuperar las categorias:", error);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar las categorias: ${error.message}`,
      data: [],
    });
  }
};



const update = async (req, res) => {
  try {
    // recuperar el id del registro a actualizar 
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: false,
        message: "El id proporcionado no es valido",
      });
    }

    // Buscar el registro a modificar por el id 
    const categoria = await Category.findById(id);

    // Validar si existe el id 
    if (!categoria) {
      return res.status(400).json({
        status: false,
        message: `El id proporcionado: ${id}, no existe en la base de datos`,
        data: [],
      });      
    }

    // Si existe actualizamos el registro con los datos recibidos en el body 
    categoria.set(req.body);
    await categoria.save();

    return res.status(200).json({
      status: true,
      message: "Categoria actualizad de forma correcta",
      data: categoria,
    });
  } catch (error) {
    console.error("Error actualizando autor:", error);
    return res.status(500).json({
      status: false,
      message: "Sucedio un error al actualizar la categoria: " + error.message,
    });
    
  }
};


const destroy = async (req, res) => {
  try {
    // recuperar el id del registro a eliminar 
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: false,
        message: "El id proporcionado no es valido",
      });
    }

    // Validar si existe el id 
    const deleteCategoria = await Category.findByIdAndDelete(id);
    if (!deleteCategoria) {
      return res.status(400).json({
        status: false,
        message: `No existe una categoria con ese id: ${id}`,
      });      
    }
    
    // Enviar mensaje de registro eliminado 
    return res.status(200).json({
    status: true,
    message: "Categoria eliminada correctamente de la base de datos",
    data: deleteCategoria,
    });
  } catch (error) {
    console.error("Error al eliminar la categoria:", error);
    return res.status(500).json({
    status: false,
    message: "Sucedio un error al eliminar la categoria:" + error.message,
    });
  }
 
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
  showByName
};
