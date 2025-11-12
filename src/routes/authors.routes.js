const { Router } = require("express");
const router = Router();
 
const { index, create, update, show, showByName, destroy } = require("../controllers/authors.controller");


router.get('/', index );

router.post('/', create);

router.get('/:id', show);

router.get('/byname/:first_name', showByName);

router.put('/:id', update);

router.delete('/:id', destroy);

module.exports = router

