

const {BSCBridge} = require('./bridge')
const express = require('express')
const server = express()
const TonWeb = require('tonweb')

async function init(){
    let bsc_bridge = new BSCBridge('Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r','0x76A797A59Ba2C17726896976B7B3747BfD1d220f')
    let transactions = await bsc_bridge.get_bsc_network_transactions()
    let transactions_1 = await bsc_bridge.get_ton_network_transactions()
    let in_ = []
    let out_ = []
    let tnw = new TonWeb()
    for (let iterator of transactions_1) {
        let msg_data = iterator.in_msg
        console.log(msg_data.message);
        if (msg_data.message.includes('swapTo')){    
            iterator.in_msg.message = msg_data.message.slice(7)
            out_.push(iterator)
            //console.log(new tnw.Address(iterator.in_msg.source).toString(false, false, true, false));
        }
        else{
            in_.push(iterator)
        }
    }
    console.log('in!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'+in_.length);
    console.log(in_.map(x=>x.in_msg));
    console.log('out!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'+out_.length);
    console.log(out_.map(x=>x.in_msg));
}
init()

server.listen(()=>{})