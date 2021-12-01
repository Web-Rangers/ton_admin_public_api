
import {block_monitor} from'../../helpers/blocks'

async function get_accounts_data() {
    return block_monitor.get_accouts_status()
}
    
export {get_accounts_data}