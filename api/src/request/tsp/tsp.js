import {Status} from '../../db/models'

async function get_tps() {
    let status = await Status.findOne({})
    return status.tpsAvg
}

export {get_tps}