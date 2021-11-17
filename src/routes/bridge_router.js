
let express = require('express');
const bridge_router = express.Router();
let {BridgeController} = require('../controller')
let {api_callback} = require('../callback')

bridge_router.get('/eth',api_callback(BridgeController.get_eth_bridge_status))
bridge_router.get('/bsc',api_callback(BridgeController.get_bsc_bridge_status))

module.exports = {bridge_router}