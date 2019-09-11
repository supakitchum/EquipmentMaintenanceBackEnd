const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = new Schema({
  firstname: String,
  lastname: String,
  type: String,
  email: String,
  password: String,
  dateofbirth: Date,
  department: String,
  position: String,
  phone: String
})

module.exports = mongoose.model('users', User)
