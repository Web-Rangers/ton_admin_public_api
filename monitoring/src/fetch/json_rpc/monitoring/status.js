import {sendJRPC} from '../send_jrpc'
import db_connection from '../../../db/dbaccess/async_connection'
import {emitter} from '../../../data/json_rpc_status'
const {execFile,exec } = require('child_process')

async function get_status() {
    let result = await sendJRPC('/','status') 
    if (result&&!result.data.error){
        let res = result.data.result
        db_connection.connection.execute('SELECT startValidation,endValidation from status').then(async(result)=>{
            if (result&&result.length>0&&res.endValidation>result[0].endValidation){
                exec(`node ${__dirname}/analyze_validators.js`,(err,s,se)=>{
                    console.log(err,s,se);
                })
                await db_connection.connection.execute(`INSERT IGNORE INTO validators_cycle_history (date_start,date_end) VALUES(${result[0].startValidation},${result[0].endValidation})`)
                await db_connection.connection.execute(`DELETE FROM validators_cycle_history WHERE date_start>${result[0].startValidation} and (date_start-${result[0].startValidation})/(60*60)<15`)
            }
            await db_connection.connection.execute(`INSERT INTO status (electionId,totalValidators,onlineValidators,startValidation,endValidation,startNextElection,endElection,tpsAvg,startElection,id) values`+
            `(${res.electionId},${res.totalValidators},${res.onlineValidators},${res.startValidation},${res.endValidation},${res.startNextElection},${res.endElection},${res.tpsAvg[0]},${res.startElection},1)`+
            ` ON DUPLICATE KEY UPDATE electionId=${res.electionId},totalValidators=${res.totalValidators},onlineValidators=${res.onlineValidators},startValidation=${res.startValidation},endValidation=${res.endValidation},startNextElection=${res.startNextElection},endElection=${res.endElection},startElection=${res.startElection},tpsAvg=${res.tpsAvg[0]}`).catch(err=>{console.log(err);})   
            emitter.emit('data_change',{electionId:res.electionId,totalValidators:res.totalValidators,onlineValidators:res.onlineValidators,startValidation:res.startValidation,endValidation:res.endValidation,startNextElection:res.startNextElection,endElection:res.endElection,tpsAvg:res.tpsAvg[0],startElection:res.startElection})
        })
        return res
    }
    return undefined
    
}
export {get_status}