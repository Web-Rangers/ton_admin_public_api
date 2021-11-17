const {get_validators} = require('./status')
const {get_elections_data} = require('./elections')
const {get_validators_list} = require('./validators_list')
const {get_complaints} = require('./complaints')

module.exports= {get_validators, get_elections_data, get_validators_list, get_complaints}