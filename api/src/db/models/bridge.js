import mongoose from 'mongoose'

const tonTransactionSchema = mongoose.Schema({
    hash: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    message: { type: String, required: true },
    coins: { type: Number, required: true },
    date: { type: Date, required: true }
})

const web3TransactionSchema = mongoose.Schema({
    hash: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    method: { type: String, required: true},
    ton_address: { type: String, required: true },
    coins: { type: Number, required: true },
    date: { type: Date, required: true }
})

const bridgeSchema = mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    web3_transactions: [{ type: mongoose.Schema.Types.Mixed, ref: 'Web3BridgeTransaction' }],
    ton_transactions: [{ type: mongoose.Schema.Types.Mixed, ref: 'TonBridgeTransaction' }]
})

const Web3BridgeTransaction = mongoose.model('Web3BridgeTransaction', web3TransactionSchema)
const TonBridgeTransaction = mongoose.model('TonBridgeTransaction', tonTransactionSchema)
const Bridge = mongoose.model('Bridge', bridgeSchema)
export {Bridge, Web3BridgeTransaction, TonBridgeTransaction}