
let jrpc = require('../../data/json_rpc_status')

async function get_offers() {
    return {'validators': jrpc.status.offers}
}
    
module.exports = {get_offers}