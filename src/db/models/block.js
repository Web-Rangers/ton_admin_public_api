import mongoose from 'mongoose'

const blockSchema = mongoose.Schema({
    hash: { type: String, required: true },
    height:{type: Number},
    transactions:[{
        from: { type: String, required: true },
        to: { type: String, required: true },
        message: { type: String, required: true }
    }],
    timestamps:{type:Number}
})

const Block = mongoose.model('Block', blockSchema)
export { Block }