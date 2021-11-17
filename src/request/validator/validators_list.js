const {sendJRPC} = require('../jsonrpc')

async function get_validators_list() {
    result = await sendJRPC('/','vl') 
    return {'validators': result.data.result}
}

module.exports = {get_validators_list}