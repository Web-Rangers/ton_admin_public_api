const mongoose = require('mongoose')

const serverSchema = mongoose.Schema({
    ip: { type: String, required: true },
    port: { type: Number, required: true},
    status: { type: Boolean, required: true},
    time: { type: Number, required: true }
}, {timestamps: true})

const Server = mongoose.model('Server', serverSchema)
module.exports = { Server }