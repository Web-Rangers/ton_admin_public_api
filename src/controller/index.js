import  {build_bridge_controller}  from './bridge'
import  {build_metrics_controller}  from './metric'
import  {build_service_controller}  from './service'
import  {build_server_chart_controller,buld_service_chart_controller}  from './chart'

let MetricController = build_metrics_controller()
let BridgeController = build_bridge_controller()
let ServiceController = build_service_controller()
let ServerChartController = build_server_chart_controller()
let ServiceChartController = buld_service_chart_controller()
export {BridgeController,MetricController,ServiceController,ServerChartController,ServiceChartController}