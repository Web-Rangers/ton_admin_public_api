import {config} from '../../config'
import {service_dataScema,serviceScema,server_dataScema,serverScema,Block,Bridge,TonBridgeTransaction,Web3BridgeTransaction,statusScema} from '../models'
import DbConnection from './db_connection'
import mongoose from 'mongoose'

let date = new Date()

config.DATABASE = `tonstatus${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
let database_config = {
    status_conn:new DbConnection(config.DM_DB_URI+'/status',{
        Block:Block,
        Bridge:Bridge,
        TonBridgeTransaction:TonBridgeTransaction,
        Web3BridgeTransaction:Web3BridgeTransaction,
        Status:statusScema
    }),
    monitoring_conn:new DbConnection(config.DM_DB_URI+'/'+config.DATABASE,{
        ServiceData:service_dataScema,
        Service:serviceScema,
        ServerData:server_dataScema,
        Server:serverScema
    })
}
function change_monirotingdb(url){
    mongoose.connections.pop()
    database_config.monitoring_conn = new DbConnection(url,{
        ServiceData:service_dataScema,
        Service:serviceScema,
        ServerData:server_dataScema,
        Server:serverScema
    })
}
export {database_config,change_monirotingdb}