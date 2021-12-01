import {Status} from '../../db/models'

async function get_validators() {
    let status = await Status.findOne({})
    return {'total':status.totalValidators,'active':status.onlineValidators}
}

export {get_validators}