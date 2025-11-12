const { Schema, model } = require("mongoose");

const categoriesSchema = new Schema(
  {
    //  nombre de la categoria
    name: { 
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      unique: true,
    },
    // descripcion de la categoria
    description: {
      type: String,
      required: [true, "la descripcion es obligatoria"],
      trim: true,
    },
      // URL o ruta de la foto asociada al autor
    image: {
      type: String,
      required: [true, "la imagen es obligatoria"],
      default: "",
    },

    // Estado del autor (activo/inactivo) — por defecto true
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
    versionKey: false, // elimina el campo __v
    collection: "categories", // nombre explícito de la colección
  }
);

module.exports = model("Category", categoriesSchema );