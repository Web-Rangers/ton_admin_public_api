import {server_chart_service} from '../../request'

const build_server_chart_controller = function() {
    return ({
        get_servers_chart,
        get_server_chart
    })

    async function get_servers_chart(request) {
        let {time_period,time_value} = request.body
        let chart = await server_chart_service.get_server_chart(time_period,time_value)
        return {status:200,result:{chart}}
    }

    async function get_server_chart(request) {
        let {ip,port,time_period,time_value} = request.body
        let chart = await server_chart_service.get_chart_by_server(ip,port,time_period,time_value)
        return {status:200,result:{chart}}
    }
}

export default build_server_chart_controller