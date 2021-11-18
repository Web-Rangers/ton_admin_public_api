const {bridges_monitor} = require('../../../helpers/bridge/bridge_monitor')

function get_eth_status() {
    return bridges_monitor.get_eth_bridge_status()
}

module.exports = {get_eth_status}