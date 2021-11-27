import express from'express'
const chart_router = express.Router();
import {ChartController} from'../controller'
import {api_callback} from'../callback'

chart_router.get('/year',api_callback(ChartController.get_year))
chart_router.get('/month',api_callback(ChartController.get_year))

export {chart_router}