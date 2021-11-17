const {bridges_monitor} = require('../../helpers/bridge/bridge_monitor')

function get_bsc_status() {
    return bridges_monitor.get_bsc_bridge_status()
}

module.exports = {get_bsc_status}