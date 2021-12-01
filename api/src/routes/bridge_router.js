import express from'express'
const bridge_router = express.Router();
import {BridgeController} from'../controller'
import {api_callback} from'../callback'

bridge_router.get('/eth/status',api_callback(BridgeController.get_eth_bridge_status))
bridge_router.get('/bsc/status',api_callback(BridgeController.get_bsc_bridge_status))

export {bridge_router}