const {sendJRPC} = require('../send_jrpc')
let {status} = require('../../../data/json_rpc_status')

async function get_status() {
    let result = await sendJRPC('/','status') 
    
    if (result&&!result.data.error){
        let res = result.data.result
        status.status.tpsAvg = res.tpsAvg
        status.status.endElection = res.endElection
        status.status.startElection = res.startElection
        status.status.startNextElection = res.startNextElection
        status.status.endValidation = res.endValidation
        status.status.electionId = res.electionId
        status.status.totalValidators = res.totalValidators
        status.status.onlineValidators = res.onlineValidators
        status.status.startValidation = res.startValidation
        return res
    }
    return undefined
    
}

module.exports = {get_status}