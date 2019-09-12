const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = new Schema({
  firstname: { type: String, default: null },
  lastname: { type: String, default: null },
  id_employee: String,
  type: String,
  email: String,
  password: { type: String, default: null },
  dateofbirth: { type: Date, default: null },
  department: { type: String, default: null },
  position: { type: String, default: null },
  phone: { type: String, default: null },
  created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('users', User)
