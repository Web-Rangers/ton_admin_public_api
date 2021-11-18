let {status} = require('../../../data/json_rpc_status')

function get_tps() {
    let tpsAvg =status.get_status().tpsAvg
    return {tps:tpsAvg}
}

module.exports = {get_tps}