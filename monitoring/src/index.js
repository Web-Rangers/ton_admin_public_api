import {bridges_monitor,status_requester,block_monitor,servers_monitor,service_monitor} from'./helpers'
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
import start_wsserver from'./wsserver'
import db_connection from './db/dbaccess/db_connection'; 

async function main(){
    await servers_monitor.create_observers()
    // await block_monitor.start_fetching()
    setInterval(async () => {
        //await bridges_monitor.fetch_data()
        //if(!block_monitor.started){
        //        await block_monitor.start_fetching()  
        //} 
        await service_monitor.checkServices()
        await servers_monitor.fetch_data()
        // await status_requester.fetch_data()  
    }, 10000);
    // start_wsserver()
}
main()


