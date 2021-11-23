const mongoose = require('mongoose')

const pageSchema = mongoose.Schema({
    url: { type: String, required: true },
    status: { type: Number, required: true},
    ping: { type: Number, required: true}
}, {timestamps: true})

const serviceSchema = mongoose.Schema({
    name: { type: String, required: true},
    pages: [{ type: mongoose.Schema.Types.Mixed, ref: 'Page' }]
})

const Page = mongoose.model('Page', pageSchema)
const Service = mongoose.model('Service', serviceSchema)
module.exports = {Service, Page}