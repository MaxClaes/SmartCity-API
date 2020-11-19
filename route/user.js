const Router = require("express-promise-router");
const router = new Router;
const userController = require('../controleur/userDB');

router.post('/login', userController.login);
router.get('/boissonCreate', userController.getCreatedBoisson);

module.exports = router;