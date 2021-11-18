const {get_bsc_status} = require('./get_bsc_status')
const {get_eth_status} = require('./get_eth_status')
const {get_bsc_bridge_transactions} = require('./get_bsc_bridge_transactions')
const {get_eth_bridge_transactions} = require('./get_eth_bridge_transactions')

module.exports = {get_bsc_status,get_eth_status,get_bsc_bridge_transactions,get_eth_bridge_transactions}