const mongoose = require('mongoose')

const Page = mongoose.Schema({
    url: { type: String, required: true },
    status: { type: String, required: true},
    ping: { type: Number, required: true},
    date: { type: Date, requeired: true }
})

const Service = mongoose.Schema({
    name: { type: String, required: true},
    pages: [{ type: mongoose.Schema.ObjectId, ref: 'Page' }]
})

module.exports = mongoose.model('Service', Service), mongoose.model('Page', Page)