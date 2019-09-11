var express = require('express')
var router = express.Router()
const AccessToken = require('../model/access_token')
const User = require('../model/users')
const Repair = require('../model/repair')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
var secret = 'inet'


router.post('/repair', [
    check('title').not().isEmpty(),
    check('detail').not().isEmpty(),
    check('position_repair').not().isEmpty()
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

    if (req.headers.token) {
        var newRepair = new Repair({
            title: req.body.title,
            detail: req.body.detail,
            position_repair: req.body.position_repair,
            image: req.body.image,
            status: "1",
            create_date: new Date(),
            id_employee_user: decoded._id
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
        res.status(201).send('Add repair success')
    } else {
        res.status(402).send({
            error: {
                status: 402,
                message: 'Unauthorized'
            }
        })
    }
})

router.get('/repair', async (req, res, next) => {
    var decoded = jwt.verify(req.headers.token, secret)
    try {
        var repair = await Repair.find({
            id_employee_user: decoded._id,
            status: '1'
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

router.get('/repair/history', async (req, res, next) => {
    var decoded = jwt.verify(req.headers.token, secret)
    try {
        var repair = await Repair.find({
            id_employee_user: decoded._id,
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

module.exports = router