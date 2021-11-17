const {sendJRPC} = require('../../helpers/jsonrpc')
let {status} = require('../json_rpc_status')

async function get_status() {
    let result = await sendJRPC('/','status') 
    if (result&&!result.error){
        status = {...result.data.result} 
        console.log(result);
        return status
    }
    return undefined
    
}

module.exports = {get_status}