import {chart_service} from '../../request'

const build_chart_controller = function() {
    return ({
        get_service_chart,
        get_page_chart,
        get_server_chart,
        get_servers_chart
    })
    async function get_service_chart(request) {
        let {service_name,time_value,time_period} = request.query
        return {status:200,result:await chart_service.get_service_chart(service_name,time_period,time_value)}
    }
    async function get_page_chart(request) {
        let {service_name,page_name,time_value,time_period} = request.query
        return {status:200,result:await chart_service.get_page_chart(service_name,page_name,time_period,time_value)}
    }
    async function get_server_chart(request) {
        let {ip,port,time_value,time_period} = request.query
        return {status:200,result:await chart_service.get_server_chart(ip,port,time_period,time_value)}
    }
    async function get_servers_chart(request) {
        let {time_value,time_period} = request.query
        return {status:200,result:await chart_service.get_servers_chart(time_period,time_value)}
    }
}

export {
    build_chart_controller
}