var express = require('express')
var router = express.Router()
const User = require('../model/users')
const AccessToken = require('../model/access_token')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
var secret = 'inet'
/* GET users listing. */
// Login for members
router.post('/login', async (req, res, next) => {
  try {
    var user = await User.findOne({
      email: req.body.email
    })
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        var token = await jwt.sign({
          _id: user.id,
          email: user.email,
          type: user.type
        }, secret, { expiresIn: 60 * 3000 })
        await AccessToken.update({ userid: user.id }, { userid: user.id, token: token }, { upsert: true })
        res.send({
          results: {
            status: 200,
            token: token,
            type: user.type
          }
        })
      } else {
        res.status(200).send({
          error: {
            status: 200,
            message: 'Password is wrong.'
          }
        })
      }
    } else {
      res.status(400).send({
        error: {
          status: 400,
          message: 'Not found you account'
        }
      })
    }
  } catch (e) {
    res.status(400).send({
      error: {
        status: 400,
        message: e
      }
    })
  }
})

module.exports = router
