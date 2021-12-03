import {get_validators,get_complaints,get_offers,get_elections_data} from './validator'
import {get_accounts_data} from './metric'
import {get_bsc_status,get_eth_status} from './bridge'
import {get_tps} from './tsp'
import {get_blocks,get_last_block} from './blocks'
import {get_liteservers,get_dhtservers} from './servers'
import {get_chart_by_page,get_chart_by_server,get_server_chart,get_service_chart} from './chart'
import {get_givers_data} from './givers/get_givers_data'

const server_chart_service = {
    get_server_chart,
    get_chart_by_server}
const service_chart_service = {
    get_chart_by_page,
    get_service_chart
}
const giver_service = {get_givers_data}
const server_service = {get_liteservers,get_dhtservers}
const metrics_service = {get_tps,get_validators,get_complaints,get_offers,get_elections_data,get_blocks,get_last_block,get_accounts_data}
const bridge_service = {get_bsc_status,get_eth_status}


export {bridge_service,metrics_service,server_service,server_chart_service,service_chart_service,giver_service}