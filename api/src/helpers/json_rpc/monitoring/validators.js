import {sendJRPC} from '../send_jrpc'
import {status,emitter} from '../../../data/json_rpc_status'

async function get_validators_list() {
    let result = await sendJRPC('/','vl') 
    if (result&&!result.data.error){
        emitter.emit('data_change',status.status)
        status.status.validators=result.data.result
        return result.data.result
    }
    return undefined
    //{'validators': result.data.result}
}

export {get_validators_list}