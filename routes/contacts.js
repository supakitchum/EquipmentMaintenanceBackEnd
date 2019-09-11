var express = require('express')
var router = express.Router()
const AccessToken = require('../model/access_token')
const Contacts = require('../model/contacts')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
var secret = 'inet'
// Get all contact
router.get('/contacts', async (req, res, next) => {
  try {
    var decoded = jwt.verify(req.headers.token, secret)
  } catch (e) {
    await AccessToken.deleteOne({ token: req.headers.token })
    res.status(401).send({
      error: {
        status: 401,
        message: 'Unauthorized'
      }
    })
  }
  try {
    var data = await Contacts.find({})
  } catch (e) {
    res.status(422).send({
      error: {
        status: 422,
        message: e
      }
    })
  }
  res.status(200).send({
    results: {
      status: 200,
      message: data,
      length: data.length
    }
  })
})

router.get('/:username/contacts/recipient', async (req, res, next) => {
  try {
    var decoded = jwt.verify(req.headers.token, secret)
  } catch (e) {
    await AccessToken.deleteOne({ token: req.headers.token })
    res.status(401).send({
      error: {
        status: 401,
        message: 'Unauthorized'
      }
    })
  }
  try {
    var data = await Contacts.find({ recipient: req.params.username })
  } catch (e) {
    res.status(422).send({
      error: {
        status: 422,
        message: e
      }
    })
  }
  res.status(200).send({
    results: {
      status: 200,
      message: data,
      length: data.length
    }
  })
})

router.get('/:username/contacts/sender', async (req, res, next) => {
  try {
    var decoded = jwt.verify(req.headers.token, secret)
  } catch (e) {
    await AccessToken.deleteOne({ token: req.headers.token })
    res.status(401).send({
      error: {
        status: 401,
        message: 'Unauthorized'
      }
    })
  }
  try {
    var data = await Contacts.find({ sender: req.params.username })
  } catch (e) {
    res.status(422).send({
      error: {
        status: 422,
        message: e
      }
    })
  }
  res.status(200).send({
    results: {
      status: 200,
      message: data,
      length: data.length
    }
  })
})

// Delete Contact
router.delete(':username/contacts', async (req, res, next) => {
  try {
    var decoded = jwt.verify(req.headers.token, secret)
  } catch (e) {
    await AccessToken.deleteOne({ token: req.headers.token })
    res.status(401).send({
      error: {
        status: 401,
        message: 'Unauthorized'
      }
    })
  }
  try {
    await Contacts.deleteMany({ sender: decoded._id, recipient: req.params.username })
  } catch (e) {
    res.status(422).json({
      error: {
        status: 422,
        message: e
      }
    })
  }
  res.status(200).json({
    results: {
      status: 200,
      message: 'Deleted contact success.'
    }
  })
})
// Add Contact
router.post('/contacts', [
  check('recipient').not().isEmpty(),
  check('sender').not().isEmpty(),
  check('title').not().isEmpty(),
  check('content').not().isEmpty()
], async (req, res, next) => {
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
    await AccessToken.deleteOne({ token: req.headers.token })
    res.status(402).send({
      error: {
        status: 402,
        message: 'Unauthorized'
      }
    })
  }
  if (req.body.sender === decoded.username) {
    var newContact = new Contacts({
      userid: decoded._id,
      recipient: req.body.recipient,
      sender: req.body.sender,
      title: req.body.title,
      content: req.body.content
    })
    try {
      newContact.save()
      res.status(200).json({
        results: {
          status: 200,
          message: 'Added contact success.'
        }
      })
    } catch (e) {
      return res.status(422).json({
        error: {
          status: 422,
          message: e
        }
      })
    }
  } else {
    return res.status(422).json({
      error: {
        status: 422,
        message: 'Sender not match with token.'
      }
    })
  }
})

module.exports = router
