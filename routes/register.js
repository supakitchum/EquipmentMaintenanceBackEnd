var express = require('express')
var router = express.Router()
const User = require('../model/users')
const bcrypt = require('bcrypt')
const saltRounds = 10
/* GET users listing. */
router.post('/register', async (req, res, next) => {
  var user = await User.findOne({
    username: req.body.username
  })
  if (user) {
    res.status(400).send({
      error: {
        status: 400,
        message: 'Username has already.'
      }
    })
  } else {
    var hash = bcrypt.hashSync(req.body.password, saltRounds)
    var newuser = new User({
      username: req.body.username,
      password: hash
    })
    try {
      newuser.save()
    } catch (e) {
      res.status(400).send({
        error: {
          status: 400,
          message: e
        }
      })
    }
    res.status(201).send('Register user success')
  }
})

module.exports = router
