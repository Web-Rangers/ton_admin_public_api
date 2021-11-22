let express = require('express');
const admin_router = express.Router();
let {AdminController} = require('../controller')
let {api_callback} = require('../callback')

admin_router.post('/login',api_callback(AdminController.login))
admin_router.post('/logout',api_callback(AdminController.logout))
admin_router.post('/proxy',api_callback(AdminController.proxy_request))
module.exports = {admin_router}