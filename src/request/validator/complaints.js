const {sendJRPC} = require('../jsonrpc')

async function get_complaints() {
    let data = await sendJRPC('/','cl')
    let result = Object.values(data.data.result)
    console.log(result)
    if (result){
        for(element in result){
            element = {'electionId': element.electionId, 'suggestedFine': element.suggestedFine, 
            'approvedPercent': approvedPercent, 'isPassed': element.isPassed}
        }
    }
    return result
}
    
module.exports = {get_complaints}