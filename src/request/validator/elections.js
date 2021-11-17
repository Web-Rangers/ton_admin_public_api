let jrpc = require('../../data/json_rpc_status')


function get_elections_data() {
    console.log(jrpc.status);
    return {'id': jrpc.electionId,'start':jrpc.startElection,
            'end': jrpc.endElection, 'next': jrpc.startNextElection}
}

module.exports = {get_elections_data}