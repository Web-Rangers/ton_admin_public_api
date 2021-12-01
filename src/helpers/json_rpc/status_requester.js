import {json_rpc_monitor} from './monitoring'
import {login} from './auth/login'

class StatusRequester{
    async fetch_data(){   
        let status = await json_rpc_monitor.get_status(); 
        let complains = await json_rpc_monitor.get_complaints_list()
        let offers = await json_rpc_monitor.get_offers_list()
        let validators = await json_rpc_monitor.get_validators_list()
        if (!status||!complains||!offers||!validators){await login();};  
    }
}
let status_requester = new StatusRequester()

export {status_requester}