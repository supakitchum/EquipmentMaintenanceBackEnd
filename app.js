var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const mongoose = require('mongoose')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var registerRouter = require('./routes/register')
var loginRouter = require('./routes/login')
var repairRouter = require('./routes/repair')
var contactRouter = require('./routes/contacts')
var technicianRouter = require('./routes/technician')
var adminRouter = require('./routes/admins')
require('dotenv').config()

var app = express()
const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env
mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  user: DB_USER,
  pass: DB_PASS,
  useNewUrlParser: true
}).then(() => {
  console.log('connect')
}).catch(err => {
  console.log(err)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/api/v1', [indexRouter, usersRouter, registerRouter, loginRouter, skillRouter, contactRouter])
app.use('/api/v1/admin', adminRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
