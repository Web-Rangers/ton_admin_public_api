import mongoose from 'mongoose'

const serverSchema = mongoose.Schema({
    ip: { type: String, required: true },
    port: { type: Number, required: true},
    data:[{
        timestamp:{type:Number},
        args:{type:Boolean},
        avg:{type:Number}
    }]  
}, {timestamps: true})

const Server = mongoose.model('Server', serverSchema)
export { Server }