import {bridges_monitor,status_requester,block_monitor,servers_monitor,service_monitor} from'./helpers'
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
import start_wsserver from'./wsserver'
import {change_monirotingdb} from './db/dbaccess'
import {config} from './config'

    async function main(){
        await servers_monitor.create_observers()
        await block_monitor.start_fetching()
        setInterval(async () => {
            await bridges_monitor.fetch_data()
            if(!block_monitor.started){
                    await block_monitor.start_fetching()  
            } 
            await service_monitor.checkServices()
            await servers_monitor.fetch_data()
            await status_requester.fetch_data()  
        }, 15000);
        start_wsserver()
    }
    main()
    setInterval(async()=>{
        let cur_date = new Date()
        let index = `tonstatus${cur_date.getFullYear()}-${cur_date.getMonth()}-${cur_date.getDate()}`
        if (config.DATABASE !=index){
            config.DATABASE=index
            change_monirotingdb(config.DM_DB_URI+'/'+index)
        }
    },1000)


