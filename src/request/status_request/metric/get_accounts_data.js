
const {block_monitor} = require('../../../helpers/blocks')

async function get_accounts_data() {
    return block_monitor.get_accouts_status()
}
    
module.exports = {get_accounts_data}