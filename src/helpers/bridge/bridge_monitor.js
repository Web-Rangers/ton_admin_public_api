let {BSCBridge,ETHBridge} = require('./')
class BridgesMonitor{

    constructor(){
        this.bsc_bridge = new BSCBridge('Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r','0x76A797A59Ba2C17726896976B7B3747BfD1d220f')
        this.eth_bridge = new ETHBridge('Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr','0x582d872a1b094fc48f5de31d3b73f2d9be47def1')
    }
    start(){
        this.calc_bsc_interval = setInterval(async () => {await this.bsc_bridge.calc_bsc_network_transactions();await this.bsc_bridge.calc_ton_network_transactions();}, 1000);
        this.calc_etht_interval = setInterval(async () => {await this.eth_bridge.calc_eth_network_transactions();await this.eth_bridge.calc_ton_network_transactions();}, 1000);
    }
    get_bsc_bridge_status(){
        return this.bsc_bridge.is_alive()
    }
    get_eth_bridge_status(){
        return this.eth_bridge.is_alive()
    }
    stop(){
        clearInterval(this.calc_bsc_interval)
        clearInterval(this.calc_etht_interval)
    }
}
const bridges_monitor = new BridgesMonitor()
module.exports = {bridges_monitor}