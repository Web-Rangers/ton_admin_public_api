import {status} from'../../data/json_rpc_status'

function get_dhtservers() {
    return status.get_status().dhtservers
}

export {get_dhtservers}