let rpc_status = require('../../data/json_rpc_status')

function get_validators() {
    return {'total':rpc_status.status.totalValidators,'active':rpc_status.status.onlineValidators}
}

module.exports = {get_validators}