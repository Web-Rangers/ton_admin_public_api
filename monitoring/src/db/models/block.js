import mongoose from 'mongoose'

const Block = mongoose.Schema({
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

export { Block }