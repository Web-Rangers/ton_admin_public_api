import express from'express'
const chart_router = express.Router();
import {ChartController} from'../controller'
import {api_callback} from'../callback'

chart_router.get('/year',api_callback(ChartController.get_year))
chart_router.get('/month',api_callback(ChartController.get_month))
chart_router.get('/week',api_callback(ChartController.get_week))
chart_router.get('/day',api_callback(ChartController.get_day))
chart_router.get('/hour',api_callback(ChartController.get_hour))

export {chart_router}