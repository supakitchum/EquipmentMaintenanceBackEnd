const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Contact = new Schema({
  userid: String,
  recipient: String,
  sender: String,
  title: String,
  content: String,
  created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('contacts', Contact)
