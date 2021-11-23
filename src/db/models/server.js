const mongoose = require('mongoose')

const serverSchema = mongoose.Schema({
    name: { type: String, required: true},
    ip: { type: String, required: true },
    port: { type: Number, required: true},
    status: { type: String, required: true}
}, {timestamps: true})

const Server = mongoose.model('Server', serverSchema)
module.exports = { Server }