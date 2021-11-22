const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blockSchema = new Schema({
    block_id: { type: Number, required: true}
}, {timestamps: true})

let Block = mongoose.model('Block', blockSchema)
module.exports = Block