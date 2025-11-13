const { Router } = require("express");
const router = Router();

/**Rutas para autores */
const authorsRouter = require("./authors.routes");
router.use('/autores', authorsRouter);

/**Rutas para categorías */
const categoriesRouter = require("./categories.routes");
router.use('/categorias', categoriesRouter);


/**Rutas para usuarios */
const usersRouter = require("./users.routes");
router.use('/usuarios', usersRouter);


module.exports = router;

