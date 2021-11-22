let {BSCBridge,ETHBridge} = require('./')
let ton_bot = require('../../telegram_bot/bot')
class BridgesMonitor{

    constructor(){
        this.bsc_bridge = new BSCBridge('Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r','0x76A797A59Ba2C17726896976B7B3747BfD1d220f')
        this.eth_bridge = new ETHBridge('Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr','0x582d872a1b094fc48f5de31d3b73f2d9be47def1')
        // this.eth_bridge.ton_out['0xF49727a4B077D486b05EA0645B5a4186fE3341d5']= [new Date() - 1000*60*20]
    }
    start(){
        this.calc_bsc_interval = setInterval(async () => {await this.bsc_bridge.calc_bsc_network_transactions();await this.bsc_bridge.calc_ton_network_transactions();}, 1000);
        this.calc_etht_interval = setInterval(async () => {await this.eth_bridge.calc_eth_network_transactions();await this.eth_bridge.calc_ton_network_transactions();}, 1000);
    }
    get_bsc_bridge_status(){
        if (this.bsc_bridge.is_alive()){
            return true
        }
        ton_bot.sendAlert("bsc bridge isdead \n ton_out_transactions:"+Object.keys(this.bsc_bridge.ton_out).join(',\n\t')+" \n bsc_out:"+Object.keys(this.bsc_bridge.bsc_out).join(',\n\t')+"")
        return false
    }

    get_bsc_bridge_transactions(){
        return {'bsc':this.bsc_bridge.bsc_out,'ton':this.bsc_bridge.ton_out}
    }

    get_eth_bridge_transactions(){
        return {'eth':this.eth_bridge.eth_out,'ton':this.eth_bridge.ton_out}
    }

    get_eth_bridge_status(){
        if (this.eth_bridge.is_alive()){
            return true
        }
        ton_bot.sendAlert("eth bridge isdead \n ton_out_transactions: \n"+Object.keys(this.eth_bridge.ton_out).join(',\n\t')+" \n eth_out:"+Object.keys(this.eth_bridge.eth_out).join(',\n\t')+"")
        return false 
    }
    stop(){
        clearInterval(this.calc_bsc_interval)
        clearInterval(this.calc_etht_interval)
    }
}
const bridges_monitor = new BridgesMonitor()
module.exports = {bridges_monitor}