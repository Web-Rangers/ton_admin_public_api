const {sendJRPC} = require('../jsonrpc')
let jrpc = require('../../../data/json_rpc_status')

async function get_offers_list() {
    let result = await sendJRPC('/','ol') 
    if (result&&!result.data.error){
        jrpc.status.offers = result.data.result
        return result.data.result
    }
    return undefined
    //{'validators': result.data.result}
}

module.exports = {get_offers_list}