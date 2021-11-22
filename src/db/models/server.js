const mongoose = require('mongoose')

const Server = mongoose.Schema({
    name: { type: String, required: true},
    ip: { type: String, required: true },
    port: { type: Number, required: true},
    status: { type: String, required: true}
}, {timestamps: true})

module.exports = mongoose.model('Server', Server)