const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Repair = new Schema({
    title: String,
    detail: String,
    position_repair: String,
    image: { type: String, default: null },
    status: String,
    create_date: Date,
    update_date: Date,
    id_employee_user: String,
    id_employee_technician: { type: String, default: null }
})

module.exports = mongoose.model('repair', Repair)