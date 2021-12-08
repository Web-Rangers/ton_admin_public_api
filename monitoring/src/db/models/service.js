import mongoose from 'mongoose'

const serviceScema = mongoose.Schema({
    name: { type: String, required: true},
    pages: [{
        name: { type: String, required: true },
        url: { type: String },
        type: { type: String}          
    }]
})
const service_dataScema = mongoose.Schema({
    service:{ type: mongoose.Schema.Types.Mixed,ref: 'Service'},
    page_name :{type: String},
    timestamp:{type:Number},
    args:{type:String},
    avg:{type:Number}  
})

export {serviceScema,service_dataScema}