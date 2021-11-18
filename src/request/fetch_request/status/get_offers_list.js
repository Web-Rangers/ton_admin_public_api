const {sendJRPC} = require('../jsonrpc')
let {status} = require('../../../data/json_rpc_status')

async function get_offers_list() {
    let result = await sendJRPC('/','ol') 
    if (result&&!result.data.error){
        status.update_status({offers:result.data.result})
        return result.data.result
    }
    return undefined
    //{'validators': result.data.result}
}

module.exports = {get_offers_list}