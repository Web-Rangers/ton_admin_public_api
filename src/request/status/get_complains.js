const {sendJRPC} = require('../jsonrpc')
let jrpc = require('../../data/json_rpc_status')

async function get_complaints() {
    let response = await sendJRPC('/','cl')
    if (response&&!response.data.error){
        let result = Object.values(response.data.result)
        if (result){
            for(element in result){
                element = {'electionId': element.electionId, 'suggestedFine': element.suggestedFine, 
                'approvedPercent': approvedPercent, 'isPassed': element.isPassed}
            }
            jrpc.status.complains = result
        }
        return {'validators': result.data.result}
    }
    return undefined
}
    
module.exports = {get_complaints}