let rpc_status = require('../../data/json_rpc_status')

function get_tps() {
    return {'tsp':Math.max(rpc_status.status.tpsAvg)}
}

module.exports = {get_tps}