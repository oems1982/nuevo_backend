const { Router } = require("express");
const router = Router();

/**Rutas para autores */

const authorsRouter = require("./authors.routes");
router.use('/autores', authorsRouter);

/**Rutas para categorias */

const categoriesRouter = require("./categories.routes");
router.use('/categorias', categoriesRouter);

module.exports = router;

