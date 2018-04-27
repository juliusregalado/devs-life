const express = require('express');
const router = express.Router();
const users_controller = require('../../controllers/users_controller')
const login_controller = require('../../controllers/login_controller')

//test route
router.get('/test', (req, res) => res.json({
  msg: "users works"
}));

router.post('/register', users_controller.users)
router.post('/login', login_controller.login)

module.exports = router;