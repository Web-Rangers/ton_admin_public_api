const mongoose = require('mongoose')

const blockTransactionSchema = mongoose.Schema({
    hash: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    message: { type: String, required: true },
    coins: { type: Number, required: true },
    date: { type: Date, required: true }
})

const blockSchema = new Schema({
    block_id: { type: Number, required: true },
    transactions: { type: Schema.Types.Mixed, ref: 'BlockTransaction'}
}, {timestamps: true})

const Block = mongoose.model('Block', blockSchema)
const BlockTransaction = mongoose.model('BlockTransaction', blockTransactionSchema)
module.exports = { Block, BlockTransaction }