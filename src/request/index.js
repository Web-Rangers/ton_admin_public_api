const {get_validators,get_complaints,get_offers,get_elections_data} = require('./validator')
const {get_bsc_status,get_eth_status} = require('./bridge');
const {get_tps} = require('./tsp')
const {login} = require('./login')
const {get_status,get_offers_list,get_complaints} = require('./status')

const interval_service = {get_status,get_offers_list,get_complaints}
const metrics_service = {get_tps,get_validators,get_complaints,get_offers,get_elections_data}
const bridge_service = {get_bsc_status,get_eth_status}
const auth_service = {login}

module.exports = {bridge_service,metrics_service,auth_service,interval_service}