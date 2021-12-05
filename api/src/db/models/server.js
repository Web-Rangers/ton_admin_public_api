import mongoose from 'mongoose'

const serverSchema = mongoose.Schema({
    ip: { type: String, required: true },
    port: { type: Number, required: true}, 
}, {timestamps: true})

const server_data = mongoose.Schema({
    server:{ type: mongoose.Schema.Types.Mixed, ref: 'Server' },
    timestamp:{type:Number},
    args:{type:Boolean},
    avg:{type:Number}  
}, {timestamps: true})

const Server = mongoose.model('Server', serverSchema)
const ServerData = mongoose.model('ServerData', server_data)

export { Server,ServerData }