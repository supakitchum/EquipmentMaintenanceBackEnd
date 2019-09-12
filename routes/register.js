var express = require('express')
var router = express.Router()
const User = require('../model/users')
const bcrypt = require('bcrypt')
const saltRounds = 10
/* GET users listing. */
router.post('/register/user', async (req, res, next) => {
  try {
    var decoded = jwt.verify(req.headers.token, secret)
  } catch (e) {
    await AccessToken.deleteOne({ token: req.headers.token })
    res.status(402).send({
      error: {
        status: 402,
        message: 'Unauthorized'
      }
    })
  }
  var user = await User.findOne({
    email: req.body.email
  })
  if (user) {
    res.status(400).send({
      error: {
        status: 400,
        message: 'Email has already.'
      }
    })
  } else {
    var hash = bcrypt.hashSync(req.body.password, saltRounds)
    var newuser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      type: 'user',
      dateofbirth: req.body.birth,
      department: req.body.department,
      position: req.body.position,
      phone: req.body.phone,
      email: req.body.email,
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

router.post('/register/technician', async (req, res, next) => {
  try {
    var decoded = jwt.verify(req.headers.token, secret)
  } catch (e) {
    await AccessToken.deleteOne({ token: req.headers.token })
    res.status(402).send({
      error: {
        status: 402,
        message: 'Unauthorized'
      }
    })
  }
  var user = await User.findOne({
    email: req.body.email
  })
  if (user) {
    res.status(400).send({
      error: {
        status: 400,
        message: 'Email has already.'
      }
    })
  } else {
    var hash = bcrypt.hashSync(req.body.password, saltRounds)
    var newuser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      type: 'technician',
      dateofbirth: req.body.birth,
      department: req.body.department,
      position: req.body.position,
      phone: req.body.phone,
      email: req.body.email,
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
