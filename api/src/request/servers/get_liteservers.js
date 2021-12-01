import {Status} from '../../db/models'

async function get_liteservers() {
    let status = await Status.findOne({})
    return status.liteservers
}

export {get_liteservers}