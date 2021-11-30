import {get_validators,get_complaints,get_offers,get_elections_data} from './validator'
import {get_accounts_data} from './metric'
import {get_bsc_status,get_eth_status,get_bsc_bridge_transactions,get_eth_bridge_transactions} from './bridge'
import {get_tps} from './tsp'
import {get_blocks_rate} from './blocks'
import {get_liteservers,get_dhtservers} from './servers'
import {server_get_year_timechart, 
    server_get_month_timechart,
    server_get_day_timechart,
    server_get_week_timechart,  
    server_get_hour_timechart,  
    service_get_year_timechart, 
    service_get_month_timechart,
    service_get_day_timechart,  
    service_get_week_timechart, 
    service_get_hour_timechart} from './chart'

const server_chart_service = {server_get_year_timechart, 
    server_get_month_timechart,
    server_get_day_timechart,
    server_get_week_timechart,  
    server_get_hour_timechart}
const service_chart_service = {
    service_get_year_timechart, 
    service_get_month_timechart,
    service_get_day_timechart,  
    service_get_week_timechart, 
    service_get_hour_timechart
}
const server_service = {get_liteservers,get_dhtservers}
const metrics_service = {get_tps,get_validators,get_complaints,get_offers,get_elections_data,get_blocks_rate,get_accounts_data}
const bridge_service = {get_bsc_status,get_eth_status,get_bsc_bridge_transactions,get_eth_bridge_transactions}


export {bridge_service,metrics_service,server_service,server_chart_service,service_chart_service}