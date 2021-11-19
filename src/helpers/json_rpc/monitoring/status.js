const {sendJRPC} = require('../send_jrpc')
let {status} = require('../../../data/json_rpc_status')

async function get_status() {
    let result = await sendJRPC('/','status') 
    if (result&&!result.data.error){
        status.update_status(result.data.result)
        return result.data.result
    }
    return undefined
    
}

module.exports = {get_status}