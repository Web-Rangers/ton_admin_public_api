const {status} = require('../../data/json_rpc_status')

function get_eth_status() {
    let {eth} = {...status.get_status().bridge}
    return eth
}

module.exports = {get_eth_status}