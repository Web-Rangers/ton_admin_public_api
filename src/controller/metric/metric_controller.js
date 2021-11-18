const {metrics_service} = require('../../request')

const build_metrics_controller = function() {
    return ({
        get_tps,
        get_validators,
        get_offers,
        get_elections_data,
        get_blocks_rate,
        get_accounts_data
    })
    async function get_tps({params}) {
        return {status:200,message:{tps:metrics_service.get_tps()}}
    }
    async function get_validators({params}) {
        return {status:200,message:{validators:metrics_service.get_validators()}}
    }
    async function get_offers({params}) {
        return {status:200,message:{offers:metrics_service.get_offers()}}
    }
    async function get_elections_data({params}) {
        return {status:200,message:{elections:metrics_service.get_elections_data()}}
    }
    async function get_blocks_rate({params}) {
        return {status:200,message:{blocks_rate:metrics_service.get_blocks_rate()}}
    }
    async function get_accounts_data({params}) {
        return {status:200,message:{accounts:metrics_service.get_accounts_data()}}
    }
}

module.exports = {
    build_metrics_controller
}