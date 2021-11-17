
const {BSCBridge, ETHBridge} = require('./helpers/bridge')
const TonWeb = require('tonweb')
const {bridges_monitor} = require('./helpers')
const {status_requester} = require('./helpers')
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const start_server = require('./server')

async function init(){
    bridges_monitor.start()
    status_requester.start()
    start_server()
}
init()
