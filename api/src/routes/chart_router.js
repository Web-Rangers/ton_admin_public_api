import express from'express'
const chart_router = express.Router();
import {ChartController} from'../controller'
import {api_callback} from'../callback'

chart_router.get('/service',api_callback(ChartController.get_service_chart))
chart_router.get('/service/page_chart',api_callback(ChartController.get_page_chart))
chart_router.get('/server',api_callback(ChartController.get_servers_chart))
chart_router.get('/server/server_chart',api_callback(ChartController.get_server_chart))
chart_router.get('/validator/period',api_callback(ChartController.get_validator_chart))
chart_router.get('/validator',api_callback(ChartController.get_validator_period_chart))
export {chart_router}