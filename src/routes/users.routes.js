const { Router } = require("express");
const router = Router();
 
const { index, create, update, show, showByName, destroy, login } = require("../controllers/users.controller");


router.get('/', index );

router.post('/', create);

router.get('/:id', show);

router.get('/byname/:first_name', showByName);

router.put('/:id', update);

router.delete('/:id', destroy);

router.post('/login', login );

module.exports = router

