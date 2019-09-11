const mongoose = require('mongoose')
const Schema = mongoose.Schema
// eslint-disable-next-line camelcase
const AccessToken = new Schema({
  userid: String,
  token: String
})

module.exports = mongoose.model('access_token', AccessToken)
