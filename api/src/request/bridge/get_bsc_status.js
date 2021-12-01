import {Status} from '../../db/models'

async function get_bsc_status() {
    let status = await Status.findOne({})
    let bsc = status.bridge['bsc']
    return bsc
}

export {get_bsc_status}