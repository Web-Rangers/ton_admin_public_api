const {interval_service,auth_service} = require('../../request')

class StatusRequester{
    async fetch_data(){   
        let status = await interval_service.get_status(); 
        let complains = await interval_service.get_complaints_list()
        let offers = await interval_service.get_offers_list()
        if (!status||!complains||!offers){await this.login();};  
    }
    async login(){
        await auth_service.login()
    }
}
let status_requester = new StatusRequester()

module.exports = {status_requester}