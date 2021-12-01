import {Status} from '../../db/models'

async function get_blocks_rate() {
    let status = await Status.findOne()
    let blocks_rate = status.last_block
    return blocks_rate
}

export {get_blocks_rate}