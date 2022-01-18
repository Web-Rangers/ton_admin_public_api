import {get_validators,get_complaints,get_offers,get_elections_data} from './validator'
import {get_accounts_data} from './metric'
import {get_bsc_status,get_eth_status} from './bridge'
import {get_tps} from './tsp'
import {get_liteservers,get_dhtservers} from './servers'
import {get_service_chart,get_page_chart,get_servers_chart,get_server_chart} from './chart'
import {get_givers_data} from './givers/get_givers_data'


const chart_service = {get_service_chart,get_page_chart,get_servers_chart,get_server_chart}
const giver_service = {get_givers_data}
const server_service = {get_liteservers,get_dhtservers}
const metrics_service = {get_tps,get_validators,get_complaints,get_offers,get_elections_data,get_accounts_data}
const bridge_service = {get_bsc_status,get_eth_status}


export {bridge_service,metrics_service,server_service,giver_service,chart_service}