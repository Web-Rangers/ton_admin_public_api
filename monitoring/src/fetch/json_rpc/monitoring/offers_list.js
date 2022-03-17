import {sendJRPC} from '../send_jrpc'
import db_connection from '../../../db/dbaccess/async_connection'

import {emitter} from '../../../data/json_rpc_status'

async function get_offers_list() {
    let result = await sendJRPC('/','ol') 
    if (result&&!result.data.error){
        result = result.data.result
        await db_connection.connection.execute('truncate status_offers;')
       
        if (result.length>0){
            let insert_str=``
            for (let offer of result) {
                if (insert_str==''){
                    insert_str+=`(${offer.approvedPercent},${offer.isPassed},${offer.endTime},${offer.roundsRemaining})`
                    continue
                }
                insert_str+=`,(${offer.approvedPercent},${offer.isPassed},${offer.endTime},${offer.roundsRemaining})`
            }
            
            if (insert_str.length>0){
                await db_connection.connection.execute(`INSERT INTO status_offers (approvedPercent,isPassed,endTime,roundsRemaining) VALUES ${insert_str}`).catch(err=>{console.log(err);})
            }
            
        }
        emitter.emit('data_change',{offers:result})
        return result
    }
    return undefined
}

export {get_offers_list}