import {sendJRPC} from '../send_jrpc'
import {status,emitter} from '../../../data/json_rpc_status'

async function get_offers_list() {
    let result = await sendJRPC('/','ol') 
    if (result&&!result.data.error){
        emitter.emit('data_change',status.status)
        status.status.offers=result.data.result
        return result.data.result
    }
    return undefined
    //{'validators': result.data.result}
}

export {get_offers_list}