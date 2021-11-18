const {bridges_monitor} = require('../../../helpers/bridge/bridge_monitor')

function get_eth_bridge_transactions() {
    return bridges_monitor.get_eth_bridge_transactions()
}

module.exports = {get_eth_bridge_transactions}