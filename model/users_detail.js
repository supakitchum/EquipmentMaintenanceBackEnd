const mongoose = require('mongoose')
const Schema = mongoose.Schema
// eslint-disable-next-line camelcase
const UsersDetail = new Schema({
  userid: String,
  firstname: String,
  lastname: String,
  age: Number,
  money: Number,
  birthday: String,
  phone: String,
  department: String,
  created_at: Date,
  updated_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('users_detail', UsersDetail)
