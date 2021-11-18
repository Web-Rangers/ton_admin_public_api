const {build_bridge_controller} = require('./bridge')
const {build_metrics_controller} = require('./metric')

let MetricController = build_metrics_controller()
let BridgeController = build_bridge_controller()

module.exports = {BridgeController,MetricController}