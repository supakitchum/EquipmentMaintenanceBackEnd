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

router.get('/users', async (req, res, next) => {
    var decoded = jwt.verify(req.headers.token, secret)
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
    res.send(users)
  } else {
    res.send({
      results: {
        status: 200,
        data: 'Data not found.'
      }
    })
  }
})

router.get('/users/:id', async (req, res, next) => {
  try {
    var users = await UserDetail.aggregate([
      { $match: { userid: req.params.id } },
      {
        $lookup:
          {
            from: 'skills',
            localField: 'userid',
            foreignField: 'userid',
            as: 'skills'
          }
      }
    ])
  } catch (e) {
    res.send({
      results: {
        status: 500,
        data: [e]
      }
    })
  }
  if (users.length > 0) {
    res.send({
      results: {
        status: 200,
        data: [users]
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

router.get('/users/departments/:department', async (req, res, next) => {
  try {
    var users = await UserDetail.aggregate([
      { $match: { department: req.params.department } },
      {
        $lookup:
          {
            from: 'skills',
            localField: 'userid',
            foreignField: 'userid',
            as: 'skills'
          }
      }
    ])
  } catch (e) {
    res.send({
      results: {
        status: 500,
        data: [e]
      }
    })
  }
  if (users.length > 0) {
    res.send({
      results: {
        status: 200,
        data: [users]
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

router.delete('/users', async (req, res, next) => {
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
  try {
    await AccessToken.deleteOne({ token: req.headers.token })
  } catch (e) {
    res.status(500).send({
      error: {
        status: 500,
        message: e
      }
    })
  }

  try {
    await UserDetail.deleteOne({ userid: decoded._id })
  } catch (e) {
    res.status(500).send({
      error: {
        status: 500,
        message: e
      }
    })
  }

  try {
    await User.deleteOne({ username: decoded.username })
  } catch (e) {
    res.status(500).send({
      error: {
        status: 500,
        message: e
      }
    })
  }
  res.send('Deleted user success.')
})

router.post('/users', [
  check('email').not().isEmpty(),
  check('type').not().isEmpty()
], async (req, res, next) => {
  // var sub = req.body.birthday.split('/')
  // const newDate = new Date(parseInt(sub[2]) - 543, parseInt(sub[1]) - 1, parseInt(sub[0]) + 1).toISOString().slice(0, 10)
  // Validation from data
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: {
        status: 422,
        message: errors.array()
      }
    })
  }

  try {
    var decoded = jwt.verify(req.headers.token, secret)
    console.log(decoded)
  } catch (e) {
    await AccessToken.deleteOne({ token: req.headers.token })
    res.status(402).send({
      error: {
        status: 402,
        message: 'Unauthorized'
      }
    })
  }

  // Check duplicate
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
    if (req.headers.token) {
      var hash = bcrypt.hashSync(req.body.password, saltRounds)
      var newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
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
    } else {
      res.status(402).send({
        error: {
          status: 402,
          message: 'Unauthorized'
        }
      })
    }
  }
})

// Update users
router.put('/users', [
  check('email').not().isEmpty(),
  check('type').not().isEmpty()
], async (req, res, next) => {
  // var sub = req.body.birthday.split('/')
  // const newDate = new Date(parseInt(sub[2]) - 543, parseInt(sub[1]) - 1, parseInt(sub[0]) + 1).toISOString().slice(0, 10)
  // Validation from data
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: {
        status: 422,
        message: errors.array()
      }
    })
  }

  try {
    var decoded = jwt.verify(req.headers.token, secret)
  } catch (e) {
    res.status(402).send({
      error: {
        status: 402,
        message: 'Unauthorized'
      }
    })
  }
  var user = await User.findOne({ _id: decoded._id })
  // Check duplicate
  if (user) {
    var hash = bcrypt.hashSync(req.body.password, saltRounds)
    // eslint-disable-next-line no-sequences
      user.firstname= req.body.firstname,
      user.lastname= req.body.lastname,
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
