const {get_validators,get_complaints,get_offers,get_elections_data} = require('./validator')
const {get_bsc_status,get_eth_status,get_bsc_bridge_transactions,get_eth_bridge_transactions} = require('./bridge');
const {get_tps} = require('./tsp')
const {login} = require('./login')
const {get_status,get_offers_list,get_complaints_list} = require('./status')
const  {get_blocks_rate} = require('./blocks')

const interval_service = {get_status,get_offers_list,get_complaints_list}
const metrics_service = {get_tps,get_validators,get_complaints,get_offers,get_elections_data,get_blocks_rate}
const bridge_service = {get_bsc_status,get_eth_status,get_bsc_bridge_transactions,get_eth_bridge_transactions}
const auth_service = {login}

module.exports = {bridge_service,metrics_service,auth_service,interval_service}