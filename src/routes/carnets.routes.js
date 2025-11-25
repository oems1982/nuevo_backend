const { Router } = require("express");
const router = Router();

const { 
  index, 
  create, 
  update, 
  show, 
  showByName, 
  destroy,
  showByDocumento
} = require("../controllers/carnets.controller");

const { validateJWT } =  require('../middlewares/validate-jwt.middleware');

router.get('/', index);

router.post('/', create);

// 👉 NUEVA RUTA (debe estar antes de '/:id')
router.get('/documento/:documento', validateJWT, showByDocumento);

router.get('/:id', validateJWT, show);

router.get('/byname/:first_name', validateJWT, showByName);

router.put('/:id', validateJWT, update);

router.delete('/:id', validateJWT, destroy);

module.exports = router;
