const {build_bridge_controller} = require('./bridge')
const {build_metrics_controller} = require('./metric')
const {build_service_controller} = require('./service')
let MetricController = build_metrics_controller()
let BridgeController = build_bridge_controller()
let ServiceController = build_service_controller()
module.exports = {BridgeController,MetricController,ServiceController}