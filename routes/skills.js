var express = require('express')
var router = express.Router()
const AccessToken = require('../model/access_token')
const Skills = require('../model/skills')
const UserDetail = require('../model/users_detail')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
var secret = 'inet'

router.get('/skills', async (req, res, next) => {
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
    var data = await Skills.find({}, { _id: 1, userid: 2, language: 3, level: 4 }, { sort: { level: -1 } })
    if (data) {
      res.status(200).json({
        results: {
          status: 200,
          data: [data]
        }
      })
    } else {
      res.status(200).json({
        results: {
          status: 200,
          message: 'User not found.'
        }
      })
    }
  } catch (e) {
    return res.status(422).json({
      error: {
        status: 422,
        message: e
      }
    })
  }
})
router.get('/skills/:language', async (req, res, next) => {
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
    var data = await Skills.find({ language: req.params.language }, { _id: 1, userid: 2, language: 3, level: 4 }, { sort: { level: -1 } })
    if (data) {
      res.status(200).json({
        results: {
          status: 200,
          data: [data]
        }
      })
    } else {
      res.status(200).json({
        results: {
          status: 200,
          message: 'User not found.'
        }
      })
    }
  } catch (e) {
    return res.status(422).json({
      error: {
        status: 422,
        message: e
      }
    })
  }
})

router.get('/skills/:department/language/:language', async (req, res, next) => {
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
    var data = await UserDetail.aggregate([
      {
        $match: {
          department: req.params.department
        }
      },
      {
        $lookup:
          {
            from: 'skills',
            localField: 'userid',
            foreignField: 'userid',
            as: 'skills'
          }
      },
      { $unwind: '$skills' },
      { $match: { 'skills.language': req.params.language } }
    ])
  } catch (e) {
    res.status(422).json({
      error: {
        status: 422,
        message: e
      }
    })
  }
  if (data.length > 0) {
    res.send({
      results: {
        status: 200,
        data: data,
        length: data.length
      }
    })
  } else {
    res.send({
      results: {
        status: 200,
        message: 'Data not found.'
      }
    })
  }
})

router.get('/skills/:language/levels/:level', async (req, res, next) => {
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
    var data = await Skills.find({ language: req.params.language, level: req.params.level }, { _id: 1, userid: 2, language: 3, level: 4 }, { sort: { level: -1 } })
    if (data) {
      res.status(200).json({
        results: {
          status: 200,
          data: [data]
        }
      })
    } else {
      res.status(200).json({
        results: {
          status: 200,
          message: 'User not found.'
        }
      })
    }
  } catch (e) {
    return res.status(422).json({
      error: {
        status: 422,
        message: e
      }
    })
  }
})

router.get('/search', async (req, res, next) => {
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
  if (req.query.firstname && req.query.lastname) {
    try {
      var results = await UserDetail.aggregate([
        { $match: { firstname: req.query.firstname, lastname: req.query.lastname } },
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
      if (results.length > 0) {
        res.status(200).json({
          results: {
            status: 200,
            data: [results]
          }
        })
      } else {
        res.status(200).json({
          results: {
            status: 200,
            message: 'Data not found.'
          }
        })
      }
    } catch (e) {
      return res.status(422).json({
        error: {
          status: 422,
          message: e
        }
      })
    }
  } else if (req.query.firstname) {
    try {
      var results = await UserDetail.aggregate([
        { $match: { firstname: req.query.firstname } },
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
      if (results.length > 0) {
        res.status(200).json({
          results: {
            status: 200,
            data: [results]
          }
        })
      } else {
        res.status(200).json({
          results: {
            status: 200,
            message: 'Data not found.'
          }
        })
      }
    } catch (e) {
      return res.status(422).json({
        error: {
          status: 422,
          message: e
        }
      })
    }
  } else if (req.query.lastname) {
    try {
      var results = await UserDetail.aggregate([
        { $match: { lastname: req.query.lastname } },
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
      if (results.length > 0) {
        res.status(200).json({
          results: {
            status: 200,
            data: [results]
          }
        })
      } else {
        res.status(200).json({
          results: {
            status: 200,
            message: 'Data not found.'
          }
        })
      }
    } catch (e) {
      return res.status(422).json({
        error: {
          status: 422,
          message: e
        }
      })
    }
  }
})

// Add user skill
router.post('/skill', [
  check('language').not().isEmpty().isIn(['node.js', 'python', 'php', 'java', 'html']).withMessage('Language invalid.'),
  check('level').not().isEmpty().isIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).withMessage('Level invalid.')
], async (req, res, next) => {
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

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: {
        status: 422,
        message: errors.array()
      }
    })
  }
  var check = await Skills.findOne({ userid: decoded.userid, language: req.body.language })
  if (!check) {
    var newSkill = new Skills({
      userid: decoded._id,
      language: req.body.language,
      level: req.body.level,
      created_at: new Date()
    })
    try {
      newSkill.save()
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
        message: 'Added skill success'
      }
    })
  } else {
    res.status(200).json({
      results: {
        status: 200,
        message: 'Duplicate skill language'
      }
    })
  }
})

// Add user skill
router.post('/skill', [
  check('language').not().isEmpty().isIn(['node.js', 'python', 'php', 'java', 'html']).withMessage('Language invalid.'),
  check('level').not().isEmpty().isIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).withMessage('Level invalid.')
], async (req, res, next) => {
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

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: {
        status: 422,
        message: errors.array()
      }
    })
  }
  var check = await Skills.findOne({ userid: decoded._id })
  if (!check) {
    var newSkill = new Skills({
      userid: decoded._id,
      language: req.body.language,
      level: req.body.level,
      created_at: new Date()
    })
    try {
      newSkill.save()
    } catch (e) {
      return res.status(422).json({
        error: {
          status: 422,
          message: e
        }
      })
    }
    return res.status(200).json({
      results: {
        status: 201,
        message: 'Added skill success'
      }
    })
  } else {
    return res.status(200).json({
      error: {
        status: 200,
        message: 'Duplicate Userid'
      }
    })
  }
})
// end add skill
// update skill
router.put('/skill', [
  check('language').not().isEmpty().isIn(['node.js', 'python', 'php', 'java', 'html']).withMessage('Language invalid.'),
  check('level').not().isEmpty().isIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).withMessage('Level invalid.'),
  check('_id').not().isEmpty()
], async (req, res, next) => {
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

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: {
        status: 422,
        message: errors.array()
      }
    })
  }

  var updateSkill = await Skills.findOne({ userid: decoded._id, _id: req.body._id })
  if (updateSkill) {
    updateSkill.language = req.body.language
    updateSkill.level = req.body.level
    updateSkill.updated_at = new Date()
    try {
      updateSkill.save()
    } catch (e) {
      res.status(422).json({
        error: {
          status: 422,
          message: e
        }
      })
    }
  }
  res.status(200).json({
    results: {
      status: 200,
      message: 'Updated skill success'
    }
  })
})
// end update skill

// delete skill
router.delete('/skills', async (req, res, next) => {
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
    await Skills.deleteMany({ userid: decoded._id })
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
      status: 201,
      message: 'Deleted skill success'
    }
  })
})
// end delete skill
module.exports = router
