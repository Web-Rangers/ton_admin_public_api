const {sendJRPC} = require('../send_jrpc')
let {status,emitter} = require('../../../data/json_rpc_status')

async function get_complaints_list() {
    let response = await sendJRPC('/','cl')
    if (response&&!response.data.error){
        let result = Object.values(response.data.result)
        if (result){
            for(element in result){
                element = {'electionId': element.electionId, 'suggestedFine': element.suggestedFine, 
                'approvedPercent': element.approvedPercent, 'isPassed': element.isPassed}
            }
            status.status.complaints=result
            emitter.emit('data_change',status.status)
        }
        return result
    }
    return undefined
}
    
module.exports = {get_complaints_list}