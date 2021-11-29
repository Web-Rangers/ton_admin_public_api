import {chart_service} from '../../request'

const build_chart_controller = function() {
    return ({
        get_year,
        get_month,
        get_day,
        get_week,
        get_hour
    })
    async function get_year(request) {
        
        let chart = await chart_service.get_year_timechart(request.body.ip,request.body.port)
        return {status:200,result:{chart}}
    }
    async function get_month(request) {
        
        let chart = await chart_service.get_month_timechart(request.body.ip,request.body.port)
        return {status:200,result:{chart}}
    }
    async function get_week(request) {
        
        let chart = await chart_service.get_week_timechart(request.body.ip,request.body.port)
        return {status:200,result:{chart}}
    }
    async function get_day(request) {
        
        let chart = await chart_service.get_day_timechart(request.body.ip,request.body.port)
        return {status:200,result:{chart}}
    }
    async function get_hour(request) {
        
        let chart = await chart_service.get_hour_timechart(request.body.ip,request.body.port)
        return {status:200,result:{chart}}
    }
}

export default build_chart_controller