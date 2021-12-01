import {sendJRPC} from '../send_jrpc'
import {Status} from '../../../db/models'

import {emitter} from '../../../data/json_rpc_status'

async function get_offers_list() {
    let result = await sendJRPC('/','ol') 
    if (result&&!result.data.error){
        let status = await Status.findOne({})
        if (!status){
            status = new Status()
        }
        emitter.emit('data_change',status)
        status.offers=result.data.result
        await status.save()
        return result.data.result
    }
    return undefined
    //{'validators': result.data.result}
}

export {get_offers_list}