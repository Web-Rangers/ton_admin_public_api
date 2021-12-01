import {status} from '../../data/json_rpc_status'

function get_bsc_status() {
    let {bsc} = {...status.get_status().bridge}
    return bsc
}

export {get_bsc_status}