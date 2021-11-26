import {metrics_service} from '../../request'

const build_metrics_controller = function() {
    return ({
        get_tps,
        get_validators,
        get_offers,
        get_elections_data,
        get_blocks_rate,
        get_accounts_data,
    })
    async function get_tps({params}) {
        return {status:200,result:{tps:metrics_service.get_tps()}}
    }
    async function get_validators({params}) {
        return {status:200,result:{validators:metrics_service.get_validators()}}
    }
    async function get_offers({params}) {
        return {status:200,result:{offers:metrics_service.get_offers()}}
    }
    async function get_elections_data({params}) {
        return {status:200,result:{elections:metrics_service.get_elections_data()}}
    }
    async function get_blocks_rate({params}) {
        return {status:200,result:{blocks_rate:metrics_service.get_blocks_rate()}}
    }
    async function get_accounts_data({params}) {
        return {status:200,result:{accounts:metrics_service.get_accounts_result()}}
    }
}

export {
    build_metrics_controller
}