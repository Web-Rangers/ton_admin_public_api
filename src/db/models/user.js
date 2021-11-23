const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    ip: { type: String, required: true }
})

const User = mongoose.model('User', userSchema)
module.exports = { User }