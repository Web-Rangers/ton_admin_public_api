const {sendJRPC} = require('../../helpers/jsonrpc')

async function get_validators() {
    let validators = await sendJRPC('/','status') 
    let result = validators.data.result
    console.log(validators.data);
    return {'total':result.totalValidators,'active':result.onlineValidators}
    
}

module.exports = {get_validators}