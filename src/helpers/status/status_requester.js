const {metrics_service} = require('../../request')
const {auth_service} = require('../../request')

class StatusRequester{
    start(){
        this.status_interval= setInterval(async () => {let status = await metrics_service.get_status(); console.log(status); if (!status){await this.login()}}, 1000);
    }
    async login(){
        await auth_service.login()
    }
    stop(){
        clearInterval(this.status_interval)
    }
}
const status_requester = new StatusRequester()

module.exports = {status_requester}