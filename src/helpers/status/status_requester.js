const {interval_service,auth_service} = require('../../request')

class StatusRequester{
    start(){
        this.status_interval= setInterval(async () => {
            let status = await interval_service.get_status(); 
            let complains = await interval_service.get_complaints_list()
            //console.log(complains);
            let offers = await interval_service.get_offers_list()
            //console.log(offers);
            if (!status||!complains||!offers){await this.login();}; 
        }, 1000);
    }
    async login(){
        await auth_service.login()
    }
    stop(){
        clearInterval(this.status_interval)
    }

}
let status_requester = new StatusRequester()

module.exports = {status_requester}