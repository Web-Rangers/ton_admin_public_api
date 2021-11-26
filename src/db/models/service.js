import mongoose from 'mongoose'

const serviceSchema = mongoose.Schema({
    name: { type: String, required: true},
    pages: [{
        name: { type: String, required: true },
        url: { type: String },
        type: { type: String},
        years:[{
            year:{type:Number},
            months :[{ 
                month:{type:Number},
                days:[{
                    day:{type:Number},
                    data:[{
                        timestamp:{type:Number},
                        args:{type:Number},
                        avg:{type:Number}
                    }]
                }]   
            }]
        }]     
    }]
})


const Service = mongoose.model('Service', serviceSchema)
export {Service}