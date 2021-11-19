const {bridges_monitor} = require('../../helpers/bridge/bridge_monitor')

function get_bsc_bridge_transactions() {
    return bridges_monitor.get_bsc_bridge_transactions()
}

module.exports = {get_bsc_bridge_transactions}