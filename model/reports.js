const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Skill = new Schema({
  userid: String,
  language: String,
  level: { type: Number, min: 1, max: 10 },
  created_at: Date,
  updated_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('skills', Skill)
