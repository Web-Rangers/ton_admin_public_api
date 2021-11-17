const {sendJRPC} = require('../jsonrpc')
let {status} = require('../../data/json_rpc_status')

async function get_status() {
    let result = await sendJRPC('/','status') 
    if (result&&!result.data.error){
        status = {...result.data.result} 
        console.log(result);
        return status
    }
    return undefined
    
}

module.exports = {get_status}