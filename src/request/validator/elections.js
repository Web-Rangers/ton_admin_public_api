let rpc_status = require('../../data/json_rpc_status')

function get_elections_data() {
    return {'id': rpc_status.status.startNextElection,'start':rpc_status.status.startElection,
            'end': rpc_status.status.endElection, 'next': rpc_status.status.startNextElection}
}

module.exports = {get_elections_data}