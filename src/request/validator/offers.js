
let {status} = require('../../data/json_rpc_status')

async function get_offers() {
    return {'offers': status.get_status().offers}
}
    
module.exports = {get_offers}