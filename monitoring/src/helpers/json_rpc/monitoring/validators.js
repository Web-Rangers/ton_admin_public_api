import {sendJRPC} from '../send_jrpc'
import {emitter} from '../../../data/json_rpc_status'
import db_connection from '../../../db/dbaccess/db_connection'
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
emitter.on('calc_vl_profit',(data)=>{
    console.log(data);
    for (let validator of validators) {
        
    }
})
export {get_validators_list}