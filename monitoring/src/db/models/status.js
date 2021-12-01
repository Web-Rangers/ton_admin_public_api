import mongoose from 'mongoose'

const statusSchema = mongoose.Schema({
    electionId: {type:Number},
    tpsAvg: [],
    totalValidators: {type:Number},
    onlineValidators: {type:Number},
    startValidation: {type:Number},
    endValidation: {type:Number},
    startNextElection: {type:Number},
    startElection: {type:Number},
    endElection: {type:Number},
    services:[],
    offers:[],
    last_block:{type:Number},
    validators:[],
    complaints:[],
    liteservers:[],
    dhtservers:[],
    blocks:[],
    bridge:{
        eth:false,
        bsc:false
    }
})


const Status = mongoose.model('status', statusSchema)
export {Status}