import {bridges_monitor} from '../../helpers/bridge/bridge_monitor'

function get_eth_bridge_transactions() {
    return bridges_monitor.get_eth_bridge_transactions()
}

export {get_eth_bridge_transactions}