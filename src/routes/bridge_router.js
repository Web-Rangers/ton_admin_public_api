import express from'express'
const bridge_router = express.Router();
import {BridgeController} from'../controller'
import {api_callback} from'../callback'

bridge_router.get('/eth/status',api_callback(BridgeController.get_eth_bridge_status))
bridge_router.get('/bsc/status',api_callback(BridgeController.get_bsc_bridge_status))

bridge_router.get('/eth/transactions',api_callback(BridgeController.get_eth_bridge_transactions))
bridge_router.get('/bsc/transactions',api_callback(BridgeController.get_bsc_bridge_transactions))

export {bridge_router}