import {Status} from '../../db/models'

async function get_eth_status() {
    let status = await Status.findOne({})
    let eth = status.bridge['eth']
    return eth
}

export {get_eth_status}