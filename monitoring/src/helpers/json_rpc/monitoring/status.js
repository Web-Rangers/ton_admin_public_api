import {sendJRPC} from '../send_jrpc'
import {Status} from '../../../db/models'
import {emitter} from '../../../data/json_rpc_status'

async function get_status() {
    let result = await sendJRPC('/','status') 
    if (result&&!result.data.error){
        let status = await Status.findOne({})
        if (!status){
            status = new Status()
        }
        let res = result.data.result
        status.tpsAvg = res.tpsAvg
        status.endElection = res.endElection
        status.startElection = res.startElection
        status.startNextElection = res.startNextElection
        status.endValidation = res.endValidation
        status.electionId = res.electionId
        status.totalValidators = res.totalValidators
        status.onlineValidators = res.onlineValidators
        status.startValidation = res.startValidation
        await status.save()
        emitter.emit('data_change',status)
        return res
    }
    return undefined
    
}

export {get_status}