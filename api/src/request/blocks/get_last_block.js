import {Block} from '../../db/models'

async function get_last_block() {
    let block = await Block.findOne()
    return {transactions:block.transactions,height:block.height}
}

export {get_last_block}