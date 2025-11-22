const { Router } = require("express");
const router = Router();

/**Rutas para autores */
const authorsRouter = require("./authors.routes");
router.use('/autores', authorsRouter);

/**Rutas para carnets */
const carnetsRouter = require("./carnets.routes");
router.use('/carnets', carnetsRouter);

/**Rutas para categorías */
const categoriesRouter = require("./categories.routes");
router.use('/categorias', categoriesRouter);

/**Rutas para empresas */
const empresasRouter = require("./empresas.routes");
router.use('/empresas', empresasRouter);

/**Rutas para plantillas */
const plantillasRouter = require("./plantillas.routes");
router.use('/plantillas', plantillasRouter);

/**Rutas para usuarios */
const usersRouter = require("./users.routes");
router.use('/usuarios', usersRouter);


module.exports = router;

