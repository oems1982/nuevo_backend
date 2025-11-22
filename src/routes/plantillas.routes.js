const { Router } = require("express");
const router = Router();
 
const { index, create, update, show, showByName, destroy } = require("../controllers/plantillas.controller");

const { validateJWT } =  require('../middlewares/validate-jwt.middleware')

router.get('/', index );

router.post('/', create);

router.get('/:id', validateJWT, show);

router.get('/byname/:name', validateJWT, showByName);

router.put('/:id', validateJWT, update);

router.delete('/:id', validateJWT, destroy);

module.exports = router

