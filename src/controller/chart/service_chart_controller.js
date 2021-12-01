import {service_chart_service} from '../../request'

const build_service_chart_controller = function() {
    return ({
        get_chart_by_page,
        get_service_chart 
    })
    
    async function get_chart_by_page(request) {
        let {service_name,page_name,time_period,time_value} = request.body
        let chart = await service_chart_service.get_chart_by_page(service_name,page_name,time_period,time_value)
        return {status:200,result:{chart}}
    }
    async function get_service_chart(request) {
        let {service_name,time_period,time_value} = request.body
        let chart = await service_chart_service.get_service_chart(service_name,time_period,time_value)
        return {status:200,result:{chart}}
    }
}

export default build_service_chart_controller