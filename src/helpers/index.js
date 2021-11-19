const {bridges_monitor} = require('./bridge/bridge_monitor') 
const {status_requester} = require('./json_rpc/status_requester')
const {block_monitor} = require('./blocks')

module.exports = {bridges_monitor,status_requester,block_monitor}