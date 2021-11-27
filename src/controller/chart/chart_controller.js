import {chart_service} from '../../request'

const build_chart_controller = function() {
    return ({
        get_year
    })
    async function get_year(request) {
        console.log(request);
        let chart = await chart_service.get_year_timechart(request.body.ip,request.body.port)
        return {status:200,result:{chart}}
    }
}

export default build_chart_controller