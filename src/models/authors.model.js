const { Schema, model } = require("mongoose");

const authorSchema = new Schema(
  {
    // Primer nombre del autor
    first_name: { 
      type: String,
      required: [true, "El primer nombre es obligatorio"],
      trim: true,
    },
    // Apellido(s) del autor
    last_name: {
      type: String,
      required: [true, "El/los apellido(s) son obligatorios"],
      trim: true,
    },
    // Biografía o reseña (opcional, pero recomendada)
    biography: {
      type: String,
      default: "",
    },

    // URL o ruta de la foto asociada al autor
    image: {
      type: String,
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
    collection: "authors", // nombre explícito de la colección
  }
);

module.exports = model("Author", authorSchema );