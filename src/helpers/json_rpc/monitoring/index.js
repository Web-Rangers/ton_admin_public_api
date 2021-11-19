const {get_complaints_list} = require('./complains')
const {get_offers_list} = require('./offers_list')
const {get_status} = require('./status')

const json_rpc_monitor = {get_complaints_list,get_offers_list,get_status}

module.exports = {json_rpc_monitor}