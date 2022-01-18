import {bridge_service} from '../../request'

const build_bridge_controller = function() {
    return ({
        get_bsc_bridge_status,
        get_eth_bridge_status
    })
    async function get_bsc_bridge_status({params}) {
        return {status:200,result:await bridge_service.get_bsc_status()}
    }
    async function get_eth_bridge_status({params}) {
        return {status:200,result:await bridge_service.get_eth_status()}
    }

}

export {
    build_bridge_controller
}