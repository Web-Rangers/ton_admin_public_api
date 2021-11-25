const {server_service} = require('../../request')

const build_service_controller = function() {
    return ({
        get_dhtservers,
        get_liteservers
    })
    async function get_liteservers({params}) {
        return {status:200,result:{liteservers:server_service.get_liteservers()}}
    }
    async function get_dhtservers({params}) {
        return {status:200,result:{dhtservers:server_service.get_dhtservers()}}
    }
}

module.exports = {
    build_service_controller
}