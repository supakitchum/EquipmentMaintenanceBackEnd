var express = require('express')
var router = express.Router()
const UserDetail = require('../model/users_detail')
const AccessToken = require('../model/access_token')
const User = require('../model/users')
const Repair = require('../model/repair')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const auth = require('./auth')
const saltRounds = 10
var secret = 'inet'


router.get('/technician',auth, async (req, res, next) => {
    try {
        var decoded = jwt.verify(req.headers.token, secret)
        // res.send(decoded)
        if(decoded){
            var data = await User.find({email: decoded.email})
            res.send(data)
        }else {
            res.send('err')
        }

    } catch (e) {
        res.send({
            results: {
                status: 500,
                data: [e]
            }
        })
    }
})

router.put('/technician', [
    check('email').not().isEmpty(),
    check('type').not().isEmpty()
], auth, async (req, res, next) => {
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
    var user = await User.findOne({ email: decoded.email })
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
router.get('/technician/repair',auth, async (req, res, next) => {
    var decoded = jwt.verify(req.headers.token, secret)
    try {
        var repair = await Repair.find({
            email: decoded.email,
            status: '2'
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
        res.send(repair)
    } else {
        res.send({
            results: {
                status: 200,
                data: 'Data not found.'
            }
        })
    }
})

router.get('/technician/repair/history',auth, async (req, res, next) => {
    var decoded = jwt.verify(req.headers.token, secret)
    try {
        var repair = await Repair.find({
            email: decoded.email,
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
        res.send(repair)
    } else {
        res.send({
            results: {
                status: 200,
                data: 'Data not found.'
            }
        })
    }
})

router.put('/technician/repair',auth, async (req, res, next) => {
    var repair = await Repair.findOne({ _id: req.body._id})
    // Check duplicate
    if (repair) {
        repair.status = req.body.status,
            repair.update_date = new Date()
        try {
            repair.save()
        } catch (e) {
            res.status(400).send({
                error: {
                    status: 400,
                    message: e
                }
            })
        }
        res.status(201).send('Updated status success')
    } else {
        res.status(200).send({
            error: {
                status: 200,
                message: 'Not found repair for update.'
            }
        })
    }
})

module.exports = router