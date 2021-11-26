import {status} from'../../data/json_rpc_status'

function get_validators() {
    let {totalValidators,onlineValidators} = {...status.get_status()}
    return {'total':totalValidators,'active':onlineValidators}
}

export {get_validators}