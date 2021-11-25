const mongoose = require('mongoose')

const pageSchema = mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    stats :[{
        months: [{
            days:[{
                hours:[{
                    f_mins:[{
                        mins:[{
                            args:{type:String},
                            avg:{type:String}
                        }]
                    }]
                }]
            }]
        }]
    }]
    
}, {timestamps: true})

const serviceSchema = mongoose.Schema({
    name: { type: String, required: true},
    pages: [{ type: mongoose.Schema.Types.Mixed, ref: 'Page' }]
})

const Page = mongoose.model('Page', pageSchema)
const Service = mongoose.model('Service', serviceSchema)
module.exports = {Service, Page}