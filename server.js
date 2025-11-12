/**
 * @fileoverview Archivo principal del servidor de la API.
 * Inicializa la aplicación Express, configura el middleware
 * para manejar JSON, define las rutas principales y ejecuta el servidor.
 *
 * @version 1.0.0
 * @author
 * Juan Carlos Guerrero Maldonado
 */

/**
 * Carga las variables de entorno desde el archivo `.env` ubicado en la raíz del proyecto.
 * Esto permite acceder a configuraciones sensibles como puertos, credenciales y claves secretas
 * mediante `process.env`.
 */
require("dotenv").config();


/** Importar el archivo de conexión a la base de datos */
const { dbConnection } = require("./src/models/database/dbconnection"); 

/**
 * Importa el módulo Express para crear la aplicación del servidor.
 * @module express
 */
const express = require("express");

/**
 * Instancia de la aplicación Express.
 * @constant
 * @type {import('express').Express}
 */
const app = express();


const cors = require("cors");
app.use(cors());

/**
 * Importa las rutas principales de la API.
 * @module routes
 */
const routes = require("./src/routes/api.routes");

/**
 * Middleware para procesar solicitudes con cuerpo en formato JSON.
 */
app.use(express.json());

/**
 * Prefijo base para todas las rutas de la API.
 * Todas las rutas definidas en `api.routes` estarán bajo `/api`.
 */
app.use("/api", routes);

/**
 * Inicia el servidor en el puerto xxxx.
 * Muestra un mensaje en consola al iniciar correctamente.
 *
 * @function
 * @async
 * @param {number} port - Puerto donde se ejecuta el servidor.
 * @example
 * // Salida esperada en consola:
 * // Servidor ejecutandose de forma correcta en el puerto XXXXX
 */
app.listen(process.env.PORT, async () => {
  console.log(`Servidor ejecutandose de forma correcta en el puerto: ${process.env.PORT}`);
  /** Conectar a la base de datos mediante mongodb */
  await dbConnection();

});
