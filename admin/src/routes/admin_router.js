import express from 'express'
import {AdminController} from '../controller'
import {api_callback} from '../callback'
const admin_router = express.Router();

admin_router.post('/login',api_callback(AdminController.login))
admin_router.post('/logout',api_callback(AdminController.logout))
admin_router.post('/proxy',api_callback(AdminController.proxy_request))
export {admin_router}