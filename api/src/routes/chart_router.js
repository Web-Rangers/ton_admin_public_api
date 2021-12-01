import express from'express'
const chart_router = express.Router();
import {ServerChartController,ServiceChartController} from'../controller'
import {api_callback} from'../callback'

chart_router.get('/server/server_chart',api_callback(ServerChartController.get_server_chart))
chart_router.get('/server',api_callback(ServerChartController.get_servers_chart))


chart_router.get('/service/pagechart',api_callback(ServiceChartController.get_chart_by_page))
chart_router.get('/service',api_callback(ServiceChartController.get_service_chart))

export {chart_router}