const {status} = require('../../../data/json_rpc_status')

function get_blocks_rate() {
    let {blocks_rate} = {...status.get_status()}
    return blocks_rate
}

module.exports = {get_blocks_rate}