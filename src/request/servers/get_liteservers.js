const {status} = require('../../data/json_rpc_status')

function get_liteservers() {
    return status.get_status().liteservers
}

module.exports = {get_liteservers}