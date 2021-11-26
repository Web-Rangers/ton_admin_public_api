import  {build_bridge_controller}  from './bridge'
import  {build_metrics_controller}  from './metric'
import  {build_service_controller}  from './service'

let MetricController = build_metrics_controller()
let BridgeController = build_bridge_controller()
let ServiceController = build_service_controller()

export {BridgeController,MetricController,ServiceController}