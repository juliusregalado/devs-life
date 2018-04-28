const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../config/keys')
const validateLoginInput = require('../validation/login');

module.exports = { 
  login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const { errors, isValid } = validateLoginInput(req.body);
    if(!isValid) {
      return res.status(400).json(errors);
    }
    User.findOne({email})
    .then(user => {
      // USER CHECK
      if(!user) {
        errors.email = 'User not found!'
        return res.status(404).json(errors);
      }
      // PASSWORD CHECK
      bcrypt.compare(password, user.password)
      .then(isMatch => {
        if(isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          }
          jwt.sign(
            payload, 
            key.secretOrKey, 
            { expiresIn: 3600 }, 
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              })
            }
          );
        } else {
          errors.password = 'Password incorrect!'
          return res.status(400).json(errors);
        }
      })
    })
  }
}