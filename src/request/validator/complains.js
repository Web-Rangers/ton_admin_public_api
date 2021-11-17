
let jrpc = require('../../data/json_rpc_status')

async function get_complaints() {
    return {'complains': jrpc.status.complains}
}
    
module.exports = {get_complaints}