let jrpc = require('../../../data/json_rpc_status')

function get_validators() {
    return {'total':jrpc.status.totalValidators,'active':jrpc.status.onlineValidators}
}

module.exports = {get_validators}