import {metrics_service,giver_service} from '../../request'

const build_metrics_controller = function() {
    return ({
        get_tps,
        get_validators,
        get_offers,
        get_elections_data,
        get_blocks,
        get_last_block,
        get_validators_list,
        get_givers
    })
    async function get_tps({params}) {
        return {status:200,result:{tps:await metrics_service.get_tps()}}
    }
    async function get_validators({params}) {
        return {status:200,result:{validators:await metrics_service.get_validators()}}
    }
    async function get_offers({params}) {
        return {status:200,result:{offers:await metrics_service.get_offers()}}
    }
    async function get_elections_data({params}) {
        return {status:200,result:{elections:await metrics_service.get_elections_data()}}
    }
    async function get_blocks(request) {
        let {offset_id,limit}  = {...request.query}
        return {status:200,result:{blocks_rate:await metrics_service.get_blocks(offset_id,limit)}}
    }
    async function get_last_block(params) {
        return {status:200,result:{blocks_rate:await metrics_service.get_last_block()}}
    }
    async function get_validators_list({params}) {
        return {status:200,result:{accounts:await metrics_service.get_validators()}}
    }
    async function get_givers({params}){
        let response = await giver_service.get_givers_data()
        return {status:200,result:{givers:response}}
    }
}

export {
    build_metrics_controller
}