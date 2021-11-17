const {sendJRPC} = require('../jrpc')

async function get_validators() {
    let validators = await sendJRPC('/','status') 
    let result = validators.data.result
    return {'total':result.totalValidators,'active':result.onlineValidators}
    
}

module.exports = {get_validators}