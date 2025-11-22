const { Schema, model } = require("mongoose");

const plantillaSchema = new Schema(
  {
    // Nombre de la plantilla
    name: { 
      type: String,
      required: [true, "El nombre de la plantilla es obligatorio"],
      trim: true,
      unique: true
      
    },
    
    // Descripción de la plantilla
    description: {
      type: String,
      trim: true,
    },

    // URL o ruta de la foto o previsualizacion de la plantilla
    image: {
      type: String,
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
    collection: "plantillas", // nombre explícito de la colección
  }
);

module.exports = model("Plantilla", plantillaSchema );