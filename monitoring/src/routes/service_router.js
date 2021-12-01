import express from 'express'
const service_router = express.Router();
import {ServiceController} from '../controller'
import {api_callback} from '../callback'

service_router.get('/lite',api_callback(ServiceController.get_liteservers))
service_router.get('/dht',api_callback(ServiceController.get_dhtservers))

export {service_router}