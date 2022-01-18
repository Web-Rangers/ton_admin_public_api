import {sendJRPC} from '../send_jrpc'
import {emitter} from '../../../data/json_rpc_status'
import db_connection from '../../../db/dbaccess/db_connection'
async function get_complaints_list() {
    let response = await sendJRPC('/','cl')
    if (response&&!response.data.error){
        let result = Object.values(response.data.result)
        if (result){
           
            db_connection.connection.execute('truncate status_complains;')
            if (result.length>0){
                let insert_str = ``
                for (let complain of result) {
                    if (insert_str==''){
                        insert_str+=`(${complain.electionId},${complain.suggestedFine},${complain.approvedPercent},${complain.isPassed})`
                        continue
                    }
                    insert_str+=`,(${complain.electionId},${complain.suggestedFine},${complain.approvedPercent},${complain.isPassed})`
                }
                if (insert_str.length>0){
                    db_connection.connection.execute(`INSERT INTO status_complains (electionId,suggestedFine,approvedPercent,isPassed) VALUES ${insert_str}`)
                }
                
            }
            result = result.map(element => element={'electionId': element.electionId, 'suggestedFine': element.suggestedFine, 
            'approvedPercent': element.approvedPercent, 'isPassed': element.isPassed}) 
            emitter.emit('data_change',{complaints:result})
        }
        emitter.emit('data_change',{complaints:result})
        return result
    }
    return undefined
}
    
export {get_complaints_list}