import {sendJRPC} from '../send_jrpc'
import {emitter} from '../../../data/json_rpc_status'
import db_connection from '../../../db/dbaccess/db_connection'
import analyze_validator from './analyze_validators' 
let validators = []
async function get_validators_list() {
    let result = await sendJRPC('/','vl') 
    if (result&&!result.data.error){
        // console.log('vl');
        // console.log(result.data.result);
        validators = result.data.result
        emitter.emit('data_change',{validators:result.data.result})
        return result.data.result
    }
    return undefined
    //{'validators': result.data.result}
}
emitter.on('calc_vl_profit',async (data)=>{
    for (let validator of validators) {
        await analyze_validator(validator.walletAddr,data[1],data[0]) 
    }
})
export {get_validators_list}