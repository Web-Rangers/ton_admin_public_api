let express = require('express');
const service_router = express.Router();
let {ServiceController} = require('../controller')
let {api_callback} = require('../callback')

service_router.get('/lite',api_callback(ServiceController.get_liteservers))
service_router.get('/dht',api_callback(ServiceController.get_dhtservers))

module.exports = {service_router}