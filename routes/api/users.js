const express = require('express');
const passport = require('passport');
const router = express.Router();
const users_controller = require('../../controllers/users_controller');
const login_controller = require('../../controllers/login_controller');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({
  msg: "users works"
}));

// @desc    Register user
// @access  Public
router.post('/register', users_controller.users)

// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', login_controller.login)

// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
})

module.exports = router;