const {sendJRPC} = require('../jsonrpc')

async function get_complaints() {
    console.log('------------------------------------');
    let result = await sendJRPC('/','cl') 
    console.log(result)
    let answer = []
    result.data.result.forEach(element => {
        answer.push({'electionId': element.electionId, 'suggestedFine': element.suggestedFine, 'approvedPercent': approvedPercent, 'isPassed': element.isPassed})
    });
    console.log(answer);
    return answer
}
    
module.exports = {get_complaints}