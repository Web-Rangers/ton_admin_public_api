import {bridges_monitor,status_requester,block_monitor,servers_monitor,service_monitor,pools_observer} from'./fetch'
import {archive_server,archive_service} from './helpers'

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
import start_wsserver from'./wsserver'
import db_connection from './db/dbaccess/db_connection'; 
import {login} from './fetch/json_rpc/auth/login'

async function fetch(){
    await service_monitor.checkServices()
    await servers_monitor.fetch_data()
    await status_requester.fetch_data()
    //await bridges_monitor.fetch_data()
    //await pools_observer()
}
async function main(){
    archive_server()
    archive_service()
    //await bridges_monitor.fetch_data()
    await login()
    await servers_monitor.create_observers()
    //await block_monitor.start_fetching()
    setInterval(async () => {
        await bridges_monitor.fetch_data()
        // if(!block_monitor.started){
        //        await block_monitor.start_fetching()  
        // } 
        await fetch()  
    }, 60000);
    setInterval(async()=>{
        await archive_server()
        await archive_service()
    },1000*60*60*24*2)
    start_wsserver()
}
main()


