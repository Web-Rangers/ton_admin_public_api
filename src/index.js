

const {BSCBridge, ETHBridge} = require('./helpers/bridge')
const TonWeb = require('tonweb')
const {get_validators} = require('./helpers/validator')
const config = require('./config')
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const axios = require('axios')
axios.default.defaults.baseURL = config.API_URL
axios.default.defaults.headers.post['Content-Type'] = 'application/json';

async function init(){
    let bsc_bridge = new BSCBridge('Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r','0x76A797A59Ba2C17726896976B7B3747BfD1d220f')
    let eth_bridge = new ETHBridge('Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr','0x582d872a1b094fc48f5de31d3b73f2d9be47def1')
   
    setInterval(async () => {await bsc_bridge.calc_bsc_network_transactions();await bsc_bridge.calc_ton_network_transactions();}, 1000);
    setInterval(async () => {await eth_bridge.calc_eth_network_transactions();await eth_bridge.calc_ton_network_transactions();}, 1000);
    // setInterval(async () => {
    //     if (!bsc_bridge.is_alive() | !eth_bridge.is_alive())
    //     {
    //         console.log('dead');
    //         console.log(bsc_bridge.ton_out);
    //         console.log(bsc_bridge.bsc_out);
    //     }
            
    //     else console.log('alive');
    // }, 1000);
    await get_validators()
    // console.log(bsc_bridge.transactions_out);
}
init()
