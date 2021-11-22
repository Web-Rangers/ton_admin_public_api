const mongoose = require('mongoose')

const Transaction = mongoose.Schema({
    hash: { type: String, required: true }
}, {timestamps: true})

const Bridge = mongoose.Schema({
    name: { type: String, required: true},
    url: { type: String, required: true },
    failed_transactions: [{ type: mongoose.Schema.ObjectId, ref: 'Transaction' }]
})

module.exports = mongoose.model('Bridge', Bridge), mongoose.model('Transaction', Bridge)