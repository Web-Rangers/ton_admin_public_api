const mongoose = require('mongoose')

const User = mongoose.Schema({
    ip: { type: String, required: true }
})

module.exports = mongoose.model('User', User)