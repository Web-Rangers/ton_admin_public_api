import {Status} from '../../db/models'


async function get_dhtservers() {
    let status = await Status.findOne({})
    return status.dhtservers
}

export {get_dhtservers}