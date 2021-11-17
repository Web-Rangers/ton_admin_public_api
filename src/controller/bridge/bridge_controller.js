const {bridge_service} = require('../../request')

const build_bridge_controller = function() {
    return ({
        get_bsc_bridge_status,
        get_eth_bridge_status
    })
    async function get_bsc_bridge_status({params}) {
        return {status:200,message:{bridge_status:bridge_service.get_bsc_status()}}
    }
    async function get_eth_bridge_status({params}) {
        return {status:200,message:{bridge_status:bridge_service.get_eth_status()}}
    }
}

module.exports = {
    build_bridge_controller
}