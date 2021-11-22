const mongoose = require('mongoose')

const Block = mongoose.Schema({
    block_id: { type: Number, required: true}
})

module.exports = mongoose.model('Block', Block)