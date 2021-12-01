import {Status} from '../../db/models'

async function get_offers() {
    let status = await Status.findOne({}) 
    return {'offers': status.offers}
}
    
export {get_offers}