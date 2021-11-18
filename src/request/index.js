const {get_validators,get_complaints,get_offers,get_elections_data} = require('./status_request/validator')
const {get_accounts_data} = require('./status_request/metric')
const {get_bsc_status,get_eth_status,get_bsc_bridge_transactions,get_eth_bridge_transactions} = require('./status_request/bridge');
const {get_tps} = require('./status_request/tsp')
const {login} = require('./fetch_request/login')
const {get_status,get_offers_list,get_complaints_list} = require('./fetch_request/status')
const {get_blocks_rate} = require('./status_request/blocks')
const {get_liteservers} = require('./status_request/servers')

const server_service = {get_liteservers}
const interval_service = {get_status,get_offers_list,get_complaints_list}
const metrics_service = {get_tps,get_validators,get_complaints,get_offers,get_elections_data,get_blocks_rate,get_accounts_data}
const bridge_service = {get_bsc_status,get_eth_status,get_bsc_bridge_transactions,get_eth_bridge_transactions}
const auth_service = {login}

module.exports = {bridge_service,metrics_service,auth_service,interval_service,server_service}