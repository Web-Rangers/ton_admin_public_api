const {bridges_monitor} = require('./bridge/bridge_monitor') 
const {status_requester} = require('./json_rpc/status_requester')
const {block_monitor} = require('./blocks')
const {servers_monitor} = require('./servers/server_monitor')
const {service_monitor} = require('./services/service_monitor')
const {auth_service} = require('./auth/auth_service')

module.exports = {bridges_monitor,status_requester,block_monitor,servers_monitor,service_monitor,auth_service}