const {sendJRPC} = require('../../helpers/jsonrpc')
let {status} = require('../json_rpc_status')

async function get_status() {
    let result = await sendJRPC('/','status') 
    status = {...result.data.result} 
    console.log(status);
    return {'total':status.totalValidators,'active':status.onlineValidators}
    
}

module.exports = {get_status}