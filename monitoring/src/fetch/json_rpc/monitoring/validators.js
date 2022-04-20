import {sendJRPC} from '../send_jrpc'
import {emitter} from '../../../data/json_rpc_status'
import db_connection from '../../../db/dbaccess/async_connection'
var workerFarm = require('worker-farm')
let worker = workerFarm(require.resolve('./analyze_validators'))

let validators = []
async function get_validators_list() {
    
    let result = await sendJRPC('/','vl') 
    if (result&&!result.data.error){
        validators = result.data.result
        let insert_str=``
        let update_str=``
        await db_connection.connection.execute('truncate status_validators;')
        for (let validator of validators) {
            if (validator.walletAddr){
                if (insert_str==''){
                    insert_str+=`('${validator.adnlAddr}','${validator.walletAddr}',${validator.efficiency},${validator.online})`
                    continue
                }
                insert_str+=`,('${validator.adnlAddr}','${validator.walletAddr}',${validator.efficiency},${validator.online})`
            }
        }
        db_connection.connection.execute(`INSERT INTO status_validators (adnlAddr,walletAddr,efficiency,online) VALUES ${insert_str} as new(a,w,e,o) on duplicate key update walletAddr=w,efficiency=e,online=o;`).catch(err=>{console.log(err);})
        emitter.emit('data_change',{validators:result.data.result})
        return result.data.result
    }
    else{
        console.log(result.data.error);
    }
    return undefined
}
export {get_validators_list}