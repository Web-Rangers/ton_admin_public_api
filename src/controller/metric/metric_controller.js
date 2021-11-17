const {metrics_service} = require('../../request')

const build_bridge_controller = function() {
    return ({
        get_bsc_bridge_status,
        get_eth_bridge_status
    })
    async function get_tps({params}) {
        return {status:200,message:{tps:metrics_service.get_tps()}}
    }
    async function get_tps({params}) {
        return {status:200,message:{tps:metrics_service.get_tps()}}
    }
}

module.exports = {
    build_bridge_controller
}