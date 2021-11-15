const {BSCBridge, ETHBridge} = require('./bridge')
const express = require('express')
const server = express()
const TonWeb = require('tonweb')
const bot = require('./telegram_bot/bot')

async function init(){
    let bsc_bridge = new BSCBridge('Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r','0x76A797A59Ba2C17726896976B7B3747BfD1d220f')
    let eth_bridge = new ETHBridge('Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr','0x582d872a1b094fc48f5de31d3b73f2d9be47def1')
   
    setInterval(async () => {
        await bsc_bridge.get_bsc_network_transactions()
        await bsc_bridge.get_ton_network_transactions()  
    }, 2000);
    // console.log(bsc_bridge.transactions_out);
}
init()

server.listen(()=>{})