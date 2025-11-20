const { Schema, model } = require("mongoose");

const carnetSchema = new Schema(
  {
    // Nombre del titular
    first_name: { 
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      
    },
        
    // Apellido(s) del titular
    last_name: {
      type: String,
      required: [true, "El/los apellido(s) son obligatorios"],
      trim: true,
    },

    // Documento de identidad del titular
    documento: {
      type: String,
      required: [true, "El documento es obligatorio"],
      trim: true,
      unique: true,
    },

    // Cargo o area (opcional, pero recomendada)
    cargo: {
      type: String,
      default: "",
    },

    // URL o ruta de la foto del titular
    foto: {
      type: String,
      default: "",
    },

    // Estado del titular (activo/inactivo) — por defecto true
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
    versionKey: false, // elimina el campo __v
    collection: "carnets", // nombre explícito de la colección
  }
);

module.exports = model("Carnet", carnetSchema );