const {status} = require('../../data/json_rpc_status')

function get_bsc_status() {
    let {bsc} = {...status.get_status().bridge}
    return bsc
}

module.exports = {get_bsc_status}