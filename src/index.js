

const {BSCBridge} = require('./bridge')
const express = require('express')
const server = express()
const TonWeb = require('tonweb')

async function init(){
    let bsc_bridge = new BSCBridge('Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r','0x76A797A59Ba2C17726896976B7B3747BfD1d220f')
}
init()

server.listen(()=>{})