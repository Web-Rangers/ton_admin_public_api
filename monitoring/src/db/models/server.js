import mongoose from 'mongoose'

const serverScema = mongoose.Schema({
    ip: { type: String, required: true },
    port: { type: Number, required: true}, 
})

const server_dataScema = mongoose.Schema({
    server:{ type: mongoose.Schema.Types.Mixed, ref: 'Server' },
    timestamp:{type:Number},
    args:{type:Boolean},
    avg:{type:Number}  
})

export { serverScema,server_dataScema }