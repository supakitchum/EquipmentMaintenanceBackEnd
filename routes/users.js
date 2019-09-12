var express = require('express')
var router = express.Router()
const UserDetail = require('../model/users_detail')
const AccessToken = require('../model/access_token')
const User = require('../model/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10
const { check, validationResult } = require('express-validator')
const auth = require('./auth')
var secret = 'inet'

router.get('/',auth, async (req, res, next) => {
    var token = req.headers.authorization
    token = token.split(' ')[1]
    var decoded = jwt.verify(token, secret)
  try {
    var users = await User.findOne({
        email: decoded.email
    })
    console.log(users)
  } catch (e) {
    res.send({
      results: {
        status: 500,
        data: [e]
      }
    })
  }
  if (users) {
    res.status(200).send({
      results: {
        status: 200,
        data: users,
        row: users.length
      }
    })
  } else {
    res.send({
      results: {
        status: 200,
        data: 'Data not found.'
      }
    })
  }
})


router.post('/', [
  check('email').not().isEmpty(),
  check('type').not().isEmpty()
],auth, async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: {
        status: 422,
        message: errors.array()
      }
    })
  }
  // try {
  //   var decoded = jwt.verify(req.headers.token, secret)
  //   console.log(decoded)
  // } catch (e) {
  //   await AccessToken.deleteOne({ token: req.headers.token })
  //   res.status(402).send({
  //     error: {
  //       status: 402,
  //       message: 'Unauthorized'
  //     }
  //   })
  // }

  var user = await User.findOne({
    email: req.body.email
  })
  if (user) {
    res.status(400).send({
      error: {
        status: 400,
        message: 'Duplicate Email'
      }
    })
  } else {
    var hash = bcrypt.hashSync(req.body.password, saltRounds)
    var newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      id_employee: req.body.id_employee,
      position: req.body.position,
      department: req.body.department,
      dateofbirth: req.body.dateofbirth,
      phone: req.body.phone,
      email: req.body.email,
      password: hash,
      type: req.body.type
    })
    try {
      newUser.save()
    } catch (e) {
      res.status(400).send({
        error: {
          status: 400,
          message: e
        }
      })
    }
    res.status(201).send('Add user success')
  }
})

// Update users
router.put('/', [
  check('email').not().isEmpty(),
  check('type').not().isEmpty()
],auth, async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: {
        status: 422,
        message: errors.array()
      }
    })
  }
  var token = req.headers.authorization
  token = token.split(' ')[1]
  var decoded = jwt.verify(token, secret)
  var user = await User.findOne({ _id: decoded._id })
  if (user) {
    var hash = bcrypt.hashSync(req.body.password, saltRounds)
      user.firstname= req.body.firstname,
      user.lastname= req.body.lastname,
      user.id_employee= req.body.id_employee,
      user.position= req.body.position,
      user.department= req.body.department,
      user.dateofbirth= req.body.dateofbirth,
      user.phone= req.body.phone,
      user.email= req.body.email,
      user.password= hash

    try {
      user.save()
    } catch (e) {
      res.status(400).send({
        error: {
          status: 400,
          message: e
        }
      })
    }
    res.status(201).send('Updated user success')
  } else {
    res.status(200).send({
      error: {
        status: 200,
        message: 'Not found user for update.'
      }
    })
  }
})
module.exports = router
