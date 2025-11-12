// Importar el modelo
const { isValidObjectId } = require("mongoose");
const Author = require("../models/authors.model");

/**
 * POST /authors
 * Crea un autor (sin restricción de unicidad)
 */
const create = async (req, res) => {
  try {
    /**Extraer los datos del body */
    const { first_name, last_name } = req.body;

    /**Validar que vengan los datos */
    if (!first_name || !last_name) {
      /**Si no vienen devolver mensaje con error */
      return res.status(400).json({
        status: false,
        message: "first_name y last_name son obligatorios",
      });
    }
    // Crea una nueva instancia del modelo Author con los datos enviados en el cuerpo de la solicitud (req.body)
    const author = new Author(req.body);

    // Guarda el nuevo registro en la base de datos MongoDB
    await author.save();

    // Envía una respuesta HTTP con código 201 (Created) para indicar que el registro fue creado exitosamente.
    return res.status(201).json({
      status: true,
      message: "Autor creado con éxito",
      data: author,
    });
  } catch (error) {
    console.error("Error creando autor:", error);

    // Devuelve una respuesta HTTP con código de estado **500** indicando un error interno en el servidor.
    return res.status(500).json({
      status: false,
      message: "Sucedió un error al crear el autor: " + error.message,
      data: null,
    });
  }
};
/**Metodo GET */
const index = async (req, res) => {

try {
  /** Traer todos los regisros de la tabla */
  const authors = await Author.find();

  /** Validar si no hay registros */
  if (authors.length === 0){
      return res.status(200).json({
        status: true,
        message: "No existen autores registrados en la base de datos",
        data: [],
      });
  }

  /**Responder con la lista de autores */
      return res.status(200).json({
      status: true,
      message: "Listado de autores obtenido con éxito",
      data: authors,
    });

} catch (error) {
  console.log(`Error al recuperar el listado de autores - error: ${error}`);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar el listado de autores - error: ${error}`,
      data: [],
    });
}

};

const show = async (req, res) => {

try {
  /**Recuperar el id del registro a mostrar */
  const { id } = req.params;

  const author = await Author.findById(id);

 return res.status(200).json({
    status: true,
    message: "Autor encontrado correcta",
    data: author,
  });
  
} catch (error) {
  console.log(`Error al recuperar el autor - error: ${error}`);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar  el autor - error: ${error}`,
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
    const { first_name } = req.params;

    // 2 Buscar autores cuyo nombre contenga el texto indicado (case-insensitive)
    const authors = await Author.find({
      first_name: { $regex: first_name, $options: "i" },
    });

    // 3 Si no hay coincidencias, devolver 404
    if (!authors || authors.length === 0) {
      return res.status(404).json({
        status: false,
        message: `No se encontraron autores que coincidan con: ${first_name}`,
        data: [],
      });
    }

    // 4 Devolver los autores encontrados
    return res.status(200).json({
      status: true,
      message: "Autores encontrados correctamente",
      data: authors,
    });

  } catch (error) {
    console.error("Error al recuperar el autor:", error);
    return res.status(500).json({
      status: false,
      message: `Error al recuperar los autores: ${error.message}`,
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
    const author = await Author.findById(id);

    // Validar si existe el id 
    if (!author) {
      return res.status(400).json({
        status: false,
        message: `El id proporcionado: ${id}, no existe en la base de datos`,
        data: [],
      });      
    }

    // Si existe actualizamos el registro con los datos recibidos en el body 
    author.set(req.body);
    await author.save();

    return res.status(200).json({
      status: true,
      message: "Autor actualizado de forma correcta",
      data: author,
    });
  } catch (error) {
    console.error("Error actualizando autor:", error);
    return res.status(500).json({
      status: false,
      message: "Sucedio un error al actualizar el autor: " + error.message,
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
    const deleteAuthor = await Author.findByIdAndDelete(id);
    if (!deleteAuthor) {
      return res.status(400).json({
        status: false,
        message: `No existe un autor con el id: ${id}`,
      });      
    }
    
    // Enviar mensaje de registro eliminado 
    return res.status(200).json({
    status: true,
    message: "Autor eliminado correctamente de la base de datos",
    data: deleteAuthor,
    });
  } catch (error) {
    console.error("Error al eliminar autor:", error);
    return res.status(500).json({
    status: false,
    message: "Sucedio un error al eliminar autor:" + error.message,
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
