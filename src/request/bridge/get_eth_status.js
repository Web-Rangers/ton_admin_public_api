import {status} from '../../data/json_rpc_status'

function get_eth_status() {
    let {eth} = {...status.get_status().bridge}
    return eth
}

export {get_eth_status}