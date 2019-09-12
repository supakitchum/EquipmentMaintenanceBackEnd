var express = require('express')
var router = express.Router()
const AccessToken = require('../model/access_token')
const User = require('../model/users')
const Repair = require('../model/repair')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const auth = require('./auth')
var secret = 'inet'


router.post('/users/repair', [
    check('title').not().isEmpty(),
    check('detail').not().isEmpty(),
    check('position_repair').not().isEmpty()
],auth, async (req, res, next) => {
    var token = req.headers.authorization
    token = token.split(' ')[1]
    var decode = jwt.verify(token, secret)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: {
                status: 422,
                message: errors.array()
            }
        })
    }

    var newRepair = new Repair({
        title: req.body.title,
        detail: req.body.detail,
        position_repair: req.body.position_repair,
        image: req.body.image,
        status: "1",
        create_date: new Date(),
        id_employee_user: decode.email
    })
    try {
        newRepair.save()
    } catch (e) {
        res.status(400).send({
            error: {
                status: 400,
                message: e
            }
        })
    }
    res.status(201).send({
        error: {
            status: 201,
            message: 'Add repair success'
        }
    })
})

router.get('/users/repair',auth, async (req, res, next) => {
    var token = req.headers.authorization
    token = token.split(' ')[1]
    var decoded = jwt.verify(token, secret)
    try {
        var repair = await Repair.find({
            id_employee_user: decoded.email,
            status: {$not:{$eq:'3'}}
        })
        console.log(repair)
    } catch (e) {
        res.send({
            results: {
                status: 500,
                data: [e]
            }
        })
    }
    if (repair) {
      res.status(200).send({
        results: {
          status: 200,
          data: repair,
          row: repair.length
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

router.get('/users/repair/history',auth, async (req, res, next) => {
    var token = req.headers.authorization
    token = token.split(' ')[1]
    var decoded = jwt.verify(token, secret)
    try {
        var repair = await Repair.find({
            id_employee_user: decoded.email,
            status: '3'
        })
        console.log(repair)
    } catch (e) {
        res.send({
            results: {
                status: 500,
                data: [e]
            }
        })
    }
    if (repair) {
        res.status(200).send({
            results: {
                status: 200,
                data: repair,
                row: repair.length
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

module.exports = router
