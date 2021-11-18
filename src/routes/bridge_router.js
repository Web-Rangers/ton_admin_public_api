let express = require('express');
const bridge_router = express.Router();
let {BridgeController} = require('../controller')
let {api_callback} = require('../callback')

bridge_router.get('/eth/status',api_callback(BridgeController.get_eth_bridge_status))
bridge_router.get('/bsc/status',api_callback(BridgeController.get_bsc_bridge_status))

bridge_router.get('/eth/transactions',api_callback(BridgeController.get_eth_bridge_transactions))
bridge_router.get('/bsc/transactions',api_callback(BridgeController.get_bsc_bridge_transactions))

module.exports = {bridge_router}