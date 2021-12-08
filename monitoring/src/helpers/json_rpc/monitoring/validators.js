import {sendJRPC} from '../send_jrpc'
import {emitter} from '../../../data/json_rpc_status'
import {database_config} from '../../../db/dbaccess'

async function get_validators_list() {
    let result = await sendJRPC('/','vl') 
    if (result&&!result.data.error){
        let status = await database_config.status_conn.models.Status.findOne({})
        if (!status){
            status = new database_config.status_conn.models.Status()
        }
        
        status.validators=result.data.result
        emitter.emit('data_change',status)
        await status.save()
        return result.data.result
    }
    return undefined
    //{'validators': result.data.result}
}

export {get_validators_list}