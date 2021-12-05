import mongoose from 'mongoose'

const serviceSchema = mongoose.Schema({
    name: { type: String, required: true},
    pages: [{
        name: { type: String, required: true },
        url: { type: String },
        type: { type: String}          
    }]
})
const service_data = mongoose.Schema({
    service:{ type: mongoose.Schema.Types.Mixed,ref: 'Service'},
    page_name :{type: String},
    timestamp:{type:Number},
    args:{type:String},
    avg:{type:Number}  
}, {timestamps: true})


const Service = mongoose.model('Service', serviceSchema)
const ServiceData = mongoose.model('ServiceData', service_data)
export {Service,ServiceData}