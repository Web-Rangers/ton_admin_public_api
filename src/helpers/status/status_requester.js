const {metrics_service} = require('../../request')
const {auth_service} = require('../../request')
const {get_complaints} = require('../../request/validator')
class StatusRequester{
    start(){
        this.status_interval= setInterval(async () => {let status = await metrics_service.get_status(); if (!status){await this.login(); }; await get_complaints()}, 1000);
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