import mongoose from 'mongoose'

const TonBridgeTransaction = mongoose.Schema({
    hash: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    message: { type: String, required: true },
    coins: { type: Number, required: true },
    date: { type: Date, required: true }
})

const Web3BridgeTransaction = mongoose.Schema({
    hash: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    method: { type: String, required: true},
    ton_address: { type: String, required: true },
    coins: { type: Number, required: true },
    date: { type: Date, required: true }
})

const Bridge = mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    web3_transactions: [{ type: mongoose.Schema.Types.Mixed, ref: 'Web3BridgeTransaction' }],
    ton_transactions: [{ type: mongoose.Schema.Types.Mixed, ref: 'TonBridgeTransaction' }]
})

export {Bridge, Web3BridgeTransaction, TonBridgeTransaction}