import {status} from'../../data/json_rpc_status'

function get_tps() {
    let tpsAvg =status.get_status().tpsAvg
    return {tps:tpsAvg}
}

export {get_tps}