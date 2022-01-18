import {metrics_service,giver_service} from '../../request'

const build_metrics_controller = function() {
    return ({
        get_tps,
        get_validators,
        get_offers,
        get_elections_data,
        get_validators_list,
        get_accounts_data,
        get_givers
    })
    async function get_tps({params}) {
        return {status:200,result:{tps:await metrics_service.get_tps()}}
    }
    async function get_validators({params}) {
        return {status:200,result:await metrics_service.get_validators()}
    }
    async function get_offers({params}) {
        return {status:200,result:await metrics_service.get_offers()}
    }
    async function get_elections_data({params}) {
        return {status:200,result:await metrics_service.get_elections_data()}
    }
    async function get_validators_list({params}) {
        return {status:200,result:await metrics_service.get_validators()}
    }
    async function get_givers({params}){
        let response = await giver_service.get_givers_data()
        return {status:200,result:{givers:response}}
    }
    async function get_accounts_data(){
        let response = await metrics_service.get_accounts_data()
        return {status:200,result:response}
    }
}

export {
    build_metrics_controller
}