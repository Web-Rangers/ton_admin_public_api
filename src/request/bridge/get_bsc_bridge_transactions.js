import {bridges_monitor} from '../../helpers/bridge/bridge_monitor'

function get_bsc_bridge_transactions() {
    return bridges_monitor.get_bsc_bridge_transactions()
}

export {get_bsc_bridge_transactions}