const {get_validators,get_complaints,get_offers,get_elections_data} = require('./validator')
const {get_accounts_data} = require('./metric')
const {get_bsc_status,get_eth_status,get_bsc_bridge_transactions,get_eth_bridge_transactions} = require('./bridge');
const {get_tps} = require('./tsp')
const {get_blocks_rate} = require('./blocks')
const {get_liteservers,get_dhtservers} = require('./servers')
const {tonadmin_login,tonadmin_proxy} = require('./admin')

const admin_service = {tonadmin_login,tonadmin_proxy}
const server_service = {get_liteservers,get_dhtservers}
const metrics_service = {get_tps,get_validators,get_complaints,get_offers,get_elections_data,get_blocks_rate,get_accounts_data}
const bridge_service = {get_bsc_status,get_eth_status,get_bsc_bridge_transactions,get_eth_bridge_transactions}


module.exports = {bridge_service,metrics_service,server_service,admin_service}