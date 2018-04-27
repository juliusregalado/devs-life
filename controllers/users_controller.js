const User = require('../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

module.exports = {
  users(req, res) {
    User.findOne({email: req.body.emai})
    .then(user => {
      if(user) {
        return res.status(400).json({email: 'Email already exists'})
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        })
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: avatar,
          password: req.body.password 
        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
          })
        })
      }
    })  
  }
}