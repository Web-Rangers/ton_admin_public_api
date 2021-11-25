const {bridges_monitor,status_requester,block_monitor,servers_monitor,service_monitor} = require('./helpers')
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const start_server = require('./server')
const start_wsserver = require('./wsserver')
const {create_service, add_page} = require('./db/operations/service')

async function start(){
    //first fetch
    await block_monitor.start_fetching()
    await servers_monitor.create_observers()
   
    setInterval(async () => {
         await bridges_monitor.fetch_data()
         if(!block_monitor.started){
             await block_monitor.start_fetching()  
         }   
         await status_requester.fetch_data()
    }, 4000);
    setInterval(async () => {
         await service_monitor.checkServices()
        // await servers_monitor.fetch_data()
    }, 15000);
    start_server()
    //start_wsserver()
}
start()
