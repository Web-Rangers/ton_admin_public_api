const {metrics_service} = require('../../request')

const build_metrics_controller = function() {
    return ({
        get_tps,
        get_validators,
        get_offers,
        get_elections_data
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
}

module.exports = {
    build_metrics_controller
}