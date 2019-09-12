const jwt = require('jsonwebtoken')
var secret = 'inet'

module.exports = (req, res, next) => {
  try {
    var token = req.headers.authorization
    token = token.split(' ')[1]
    var decode = jwt.verify(token, secret)
    if (decode) {
      req.userid = decode.userid
      next()
    }
  } catch (error) {
    res.status(401).send({
      error: {
        status: 401,
        message: error.message
      }
    })
  }
}
