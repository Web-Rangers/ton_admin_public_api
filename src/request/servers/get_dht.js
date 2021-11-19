const {status} = require('../../data/json_rpc_status')

function get_dhtservers() {
    return status.get_status().dhtservers
}

module.exports = {get_dhtservers}