
let express = require('express');
const metric_router = express.Router();
let {MetricController} = require('../controller')
let {api_callback} = require('../callback')

metric_router.get('/validators',api_callback(MetricController.get_validators))
metric_router.get('/tps',api_callback(MetricController.get_tps))
metric_router.get('/offers',api_callback(MetricController.get_offers))
metric_router.get('/elections',api_callback(MetricController.get_elections_data))
metric_router.get('/blocks',api_callback(MetricController.get_blocks_rate))
metric_router.get('/accounts',api_callback(MetricController.get_accounts_data))

module.exports = {metric_router}