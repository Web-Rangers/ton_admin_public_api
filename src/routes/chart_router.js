import express from'express'
const chart_router = express.Router();
import {ServerChartController,ServiceChartController} from'../controller'
import {api_callback} from'../callback'

chart_router.get('/server/year',api_callback(ServerChartController.get_year))
chart_router.get('/server/month',api_callback(ServerChartController.get_month))
chart_router.get('/server/week',api_callback(ServerChartController.get_week))
chart_router.get('/server/day',api_callback(ServerChartController.get_day))
chart_router.get('/server/hour',api_callback(ServerChartController.get_hour))

chart_router.get('/service/year',api_callback(ServiceChartController.get_year))
chart_router.get('/service/month',api_callback(ServiceChartController.get_month))
chart_router.get('/service/week',api_callback(ServiceChartController.get_week))
chart_router.get('/service/day',api_callback(ServiceChartController.get_day))
chart_router.get('/service/hour',api_callback(ServiceChartController.get_hour))

export {chart_router}