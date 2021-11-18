let {status} = require('../../../data/json_rpc_status')

function get_validators() {
    let {totalValidators,onlineValidators} = {...status.get_status()}
    return {'total':totalValidators,'active':onlineValidators}
}

module.exports = {get_validators}