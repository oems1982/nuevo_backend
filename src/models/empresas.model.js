const { Schema, model } = require("mongoose");

const empresaSchema = new Schema(
  {
    //Nombre de la empresa
    name: { 
      type: String,
      required: [true, "El nombre de la empresa es obligatorio"],
      trim: true,
      unique: true,
      
    },
    
    // NIT de la empresa
    nit: {
      type: String,
      required: [true, "La direccion es obligatoria"],
      trim: true,
      unique: true,
    },

    
    // Direccion de la empresa
    adress: {
      type: String,
      trim: true,
    },

    // URL o ruta del logo de la emprsa
    logo: {
      type: String,
      default: "",
    },

    // Estado de la empresa (activo/inactivo) — por defecto true
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
    versionKey: false, // elimina el campo __v
    collection: "empresas", // nombre explícito de la colección
  }
);

module.exports = model("Empresa", empresaSchema );