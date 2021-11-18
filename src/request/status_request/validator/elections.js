let jrpc = require('../../../data/json_rpc_status')


function get_elections_data() {
    return {'id': jrpc.status.electionId,'start':jrpc.status.startElection,
            'end': jrpc.status.endElection, 'next': jrpc.status.startNextElection}
}

module.exports = {get_elections_data}