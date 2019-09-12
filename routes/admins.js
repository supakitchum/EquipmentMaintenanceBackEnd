var express = require('express')
var router = express.Router()
const AccessToken = require('../model/access_token')
const Skills = require('../model/skills')
const Users = require('../model/users')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const auth = require('./auth')
var secret = 'inet'

// Manage User
// Get all users
router.get('/users',auth, async (req, res, next) => {
  var users = await Users.find({ type: 'user'}, {
      firstname: 1,
      lastname: 1,
      type: 1,
      email: 1,
      dateofbirth: 1,
      department: 1,
      position: 1,
      phone: 1,
      created_at: 1
    }
  )
  if (users.length > 0) {
    res.send({
      results: {
        status: 200,
        data: [users],
        row: users.length
      }
    })
  } else {
    res.send({
      results: {
        status: 200,
        data: 'Data not found.',
        row: users.length
      }
    })
  }
})
// Delete user
router.delete('/users', auth , async (req, res, next) => {
  try {
    await AccessToken.deleteOne({ email: req.body.email })
    res.status(200).send({
      success: {
        status: 200,
        message: 'Delete Success'
      }
    })
  } catch (e) {
    res.status(500).send({
      error: {
        status: 500,
        message: e
      }
    })
  }
})
// Get detail of user by username
router.get('/users/:email', auth, async (req, res, next) => {
  var users = await Users.find({email: req.params.email}, {
      firstname: 1,
      lastname: 1,
      type: 1,
      email: 1,
      dateofbirth: 1,
      department: 1,
      position: 1,
      phone: 1,
      created_at: 1
    }
  )
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
// Add users
router.post('/users',auth, async (req, res, next) => {
  var user = await Users.findOne({
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
// Update users
router.put('/users',auth, async (req, res, next) => {
  var user = await Users.findOne({ email: req.body.email})
  // Check duplicate
  if (user) {
    // eslint-disable-next-line no-sequences
    user.firstname = req.body.firstname
    user.lastname = req.body.lastname
    user.dateofbirth = req.body.birth
    user.department = req.body.department
    user.position = req.body.position
    user.phone = req.body.phone
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
    res.status(200).send({
      success: {
        status: 200,
        message: 'Updated user success'
      }
    })
  } else {
    res.status(200).send({
      error: {
        status: 200,
        message: 'Not found user for update.'
      }
    })
  }
})

// Technician
// Get All
router.get('/technicians',auth, async (req, res, next) => {
  var users = await Users.find({ type: 'technician' }, {
      firstname: 1,
      lastname: 1,
      type: 1,
      email: 1,
      dateofbirth: 1,
      department: 1,
      position: 1,
      phone: 1,
      created_at: 1
    }
  )
  if (users.length > 0) {
    res.send({
      results: {
        status: 200,
        data: [users],
        row: users.length
      }
    })
  } else {
    res.send({
      results: {
        status: 200,
        data: 'Data not found.',
        row: users.length
      }
    })
  }
})
// Delete
router.delete('/technicians',auth, async (req, res, next) => {
  try {
    await AccessToken.deleteOne({ email: req.body.email })
    res.status(200).send({
      success: {
        status: 200,
        message: 'Delete Success'
      }
    })
  } catch (e) {
    res.status(500).send({
      error: {
        status: 500,
        message: e
      }
    })
  }
})

//Add technician
router.post('/technicians',auth, async (req, res, next) => {
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

// Update
router.put('/technicians',auth, async (req, res, next) => {
  var user = await Users.findOne({ email: req.body.email})
  // Check duplicate
  if (user) {
    // eslint-disable-next-line no-sequences
    user.firstname = req.body.firstname
    user.lastname = req.body.lastname
    user.dateofbirth = req.body.birth
    user.department = req.body.department
    user.position = req.body.position
    user.phone = req.body.phone
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
    res.status(200).send({
      success: {
        status: 200,
        message: 'Updated user success'
      }
    })
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
