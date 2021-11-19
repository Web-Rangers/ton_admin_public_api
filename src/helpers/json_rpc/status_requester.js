const {json_rpc_monitor} = require('./monitoring')
const {login} = require('./auth/login')

class StatusRequester{
    async fetch_data(){   
        let status = await json_rpc_monitor.get_status(); 
        let complains = await json_rpc_monitor.get_complaints_list()
        let offers = await json_rpc_monitor.get_offers_list()
        if (!status||!complains||!offers){await login();};  
    }
}
let status_requester = new StatusRequester()

module.exports = {status_requester}