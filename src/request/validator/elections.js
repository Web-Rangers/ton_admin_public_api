import {status} from'../../data/json_rpc_status'


function get_elections_data() {
    let {electionId,startElection,endElection,startNextElection} = {...status.get_status()}
    return {'id': electionId,'start':startElection,
            'end': endElection, 'next': startNextElection}
}

export {get_elections_data}