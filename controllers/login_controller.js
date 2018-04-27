const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = { 
  login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email})
    .then(user => {
      if(!user) {
        return res.status(404).json({
          email: 'user not found'
        });
      }
      bcrypt.compare(password, user.password)
      .then(isMatch => {
        if(isMatch) {
          res.json({
            msg: 'Success'
          });
        } else {
          return res.status(400).json({
            password: 'Password Incorrect'
          });
        }
      })
    })
  }
}