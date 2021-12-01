import {Status} from '../../db/models'


async function get_elections_data() {
    let status = await Status.findOne({}) 
    return {'id': status.electionId,'start':status.startElection,
            'end': status.endElection, 'next': status.startNextElection}
}

export {get_elections_data}