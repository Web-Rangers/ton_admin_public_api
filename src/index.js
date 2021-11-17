
const {BSCBridge, ETHBridge} = require('./helpers/bridge')
const TonWeb = require('tonweb')
const {bridges_monitor,status_requester,block_monitor} = require('./helpers')
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const start_server = require('./server')
const start_wsserver = require('./wsserver')

async function init(){
    bridges_monitor.start()
    status_requester.start()
    await block_monitor.start()
    start_server()
    //start_wsserver()
}
init()
