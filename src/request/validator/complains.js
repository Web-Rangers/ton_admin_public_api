
let {status} = require('../../data/json_rpc_status')

async function get_complaints() {
    return {complains:status.get_status().complains}
}
    
module.exports = {get_complaints}