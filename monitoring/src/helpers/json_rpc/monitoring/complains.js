import {sendJRPC} from '../send_jrpc'
import {emitter} from '../../../data/json_rpc_status'
import {database_config} from '../../../db/dbaccess'

async function get_complaints_list() {
    let response = await sendJRPC('/','cl')
    if (response&&!response.data.error){
        let result = Object.values(response.data.result)
        if (result){
            let status = await database_config.status_conn.models.Status.findOne({})
            if (!status){
                status = new database_config.status_conn.models.Status()
            }
            result = result.map(element => element={'electionId': element.electionId, 'suggestedFine': element.suggestedFine, 
            'approvedPercent': element.approvedPercent, 'isPassed': element.isPassed}) 
            status.complaints=result
            emitter.emit('data_change',status)
        }
        return result
    }
    return undefined
}
    
export {get_complaints_list}