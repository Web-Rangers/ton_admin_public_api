const {bridges_monitor,status_requester,block_monitor} = require('./helpers')
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const start_server = require('./server')
const start_wsserver = require('./wsserver')

async function start(){
    await block_monitor.start_fetching()
    setInterval(async () => {
        await bridges_monitor.fetch_data()
        if(!block_monitor.started){
            await block_monitor.start_fetching()  
        }
        await status_requester.fetch_data()
    }, 1000);
    start_server()
    start_wsserver()
}
start()
