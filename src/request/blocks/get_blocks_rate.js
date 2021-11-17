const {block_monitor} = require('../../helpers/blocks')

function get_blocks_rate() {
    return {'last_block':block_monitor.get_last_block(),'blocks_rate':block_monitor.get_blocks_rate()}
}

module.exports = {get_blocks_rate}