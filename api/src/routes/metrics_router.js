

import express from 'express'
import {MetricController} from '../controller'
import {api_callback} from '../callback'

const metric_router = express.Router();


metric_router.get('/validators',api_callback(MetricController.get_validators))
metric_router.get('/tps',api_callback(MetricController.get_tps))
metric_router.get('/offers',api_callback(MetricController.get_offers))
metric_router.get('/elections',api_callback(MetricController.get_elections_data))
metric_router.get('/blocks',api_callback(MetricController.get_blocks))
metric_router.get('/blocks/last',api_callback(MetricController.get_last_block))
metric_router.get('/givers',api_callback(MetricController.get_givers))
// metric_router.get('/accounts',api_callback(MetricController.get_accounts_data))

export {metric_router}