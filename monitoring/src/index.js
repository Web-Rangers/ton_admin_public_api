import {bridges_monitor,status_requester,block_monitor,servers_monitor,service_monitor} from'./helpers'
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
import start_server from'./server'
import start_wsserver from'./wsserver'

async function start(){
    // first fetch
    await block_monitor.start_fetching()
    await servers_monitor.create_observers()
   
    setInterval(async () => {   
        await bridges_monitor.fetch_data()
        if(!block_monitor.started){
             await block_monitor.start_fetching()  
        }   
    }, 4000);
    setInterval(async () => {
        await service_monitor.checkServices()
        await servers_monitor.fetch_data()
        await status_requester.fetch_data()
    }, 15000);
    
    start_wsserver()
}
start()