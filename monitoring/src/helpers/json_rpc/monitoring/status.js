import {sendJRPC} from '../send_jrpc'
import db_connection from '../../../db/dbaccess/db_connection'
import {emitter} from '../../../data/json_rpc_status'
import analyze_validator from './analyze_validators'
let end_validation = 0
let start_validation = 0
async function get_status() {
   
    let result = await sendJRPC('/','status') 
    if (result&&!result.data.error){
        let res = result.data.result
        db_connection.connection.execute(`INSERT INTO status (electionId,totalValidators,onlineValidators,startValidation,endValidation,startNextElection,endElection,tpsAvg,startElection,id) values`+
        `(${res.electionId},${res.totalValidators},${res.onlineValidators},${res.startValidation},${res.endValidation},${res.startNextElection},${res.endElection},${res.tpsAvg[0]},${res.startElection},1)`+
        ` ON DUPLICATE KEY UPDATE electionId=${res.electionId},totalValidators=${res.totalValidators},onlineValidators=${res.onlineValidators},startValidation=${res.startValidation},endValidation=${res.endValidation},startNextElection=${res.startNextElection},endElection=${res.endElection},startElection=${res.startElection},tpsAvg=${res.tpsAvg[0]}`)
        if (start_validation==0&&end_validation==0){
            start_validation = res.startValidation
            end_validation = res.endValidation
            emitter.emit('calc_vl_profit',[end_validation,start_validation])
        }
        if (res.endValidation>end_validation){
            emitter.emit('calc_vl_profit',[end_validation,start_validation])
            end_validation = res.endValidation
            start_validation = res.startValidation
        }
        
        emitter.emit('data_change',{electionId:res.electionId,totalValidators:res.totalValidators,onlineValidators:res.onlineValidators,startValidation:res.startValidation,endValidation:res.endValidation,startNextElection:res.startNextElection,endElection:res.endElection,tpsAvg:res.tpsAvg[0],startElection:res.startElection})
        
        return res
    }
    return undefined
    
}

export {get_status}