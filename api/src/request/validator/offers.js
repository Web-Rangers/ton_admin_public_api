
import {status} from'../../data/json_rpc_status'

async function get_offers() {
    return {'offers': status.get_status().offers}
}
    
export {get_offers}