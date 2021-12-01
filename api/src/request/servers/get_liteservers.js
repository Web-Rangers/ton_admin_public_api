import {status} from'../../data/json_rpc_status'

function get_liteservers() {
    return status.get_status().liteservers
}

export {get_liteservers}