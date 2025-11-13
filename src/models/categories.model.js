const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    // Primer nombre del categoria
    name: { 
      type: String,
      required: [true, "El primer nombre es obligatorio"],
      trim: true,
      unique: true
      
    },
    
    // Descripción de la categpría
    description: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },

    // URL o ruta de la foto asociada al categoria
    image: {
      type: String,
      required: [true, "La imagen es obligatoria"],
      default: "",
    },

    // Estado del categoria (activo/inactivo) — por defecto true
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

module.exports = model("Category", categorySchema );