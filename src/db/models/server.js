import mongoose from 'mongoose'

const serverSchema = mongoose.Schema({
    ip: { type: String, required: true },
    port: { type: Number, required: true},
    years:[{
        year:{type:Number},
        months :[{ 
            month:{type:Number},
            days:[{
                day:{type:Number},
                data:[{
                    timestamp:{type:Number},
                    args:{type:Boolean},
                    avg:{type:Number}
                }]
            }]   
        }]
    }]
}, {timestamps: true})

const Server = mongoose.model('Server', serverSchema)
export { Server }