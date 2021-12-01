import mongoose from 'mongoose'

const blockSchema = mongoose.Schema({
  
    height:{type: Number},
    transactions:[{
        hash: { type: String},
        from: {type: String},
        to: {type: String},
        type:{type: String},
        direction:{type: String},
        value:{type: Number},
        message:{type: String}
    }],
    timestamps:{type:Number}
})

const Block = mongoose.model('Block', blockSchema)
export { Block }