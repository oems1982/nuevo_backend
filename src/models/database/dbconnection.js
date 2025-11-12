const mongoose = require("mongoose");

const dbConnection = async() =>{
  try {
    
    await mongoose.connect(process.env.MONGO_DB);

    console.log("Conectado con exito a la base de datos de mongo");


  } catch (error) {
     console.log(`Error al conectarse a la base de datos: ${error}`);
     throw new Error(`Error al conectarse a la base de datos: ${error}`);
  }
}

module.exports = {
  dbConnection
}