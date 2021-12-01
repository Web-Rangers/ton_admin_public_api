
import {status} from'../../data/json_rpc_status'

async function get_complaints() {
    return {complains:status.get_status().complains}
}
    
export {get_complaints}