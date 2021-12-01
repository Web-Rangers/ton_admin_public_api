import {Status} from '../../db/models'

async function get_complaints() {
    let status = await Status.findOne({})
    
    return {complains:status.complains}
}
    
export {get_complaints}