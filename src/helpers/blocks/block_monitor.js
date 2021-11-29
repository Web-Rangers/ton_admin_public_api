
import TonWeb from 'tonweb'
import {BlocksStorageImpl} from './block_subscribe'
import {known_accounts} from '../../data/known_accounts'

class BlocksMonitor{
    started = false
    constructor(){
        this.active_accouts = {}
        this.transactions = []
        this.ton_web = new TonWeb()
        this.onTransaction = this.onTransaction.bind(this)
        
        this.blockSubscribe = new this.ton_web.BlockSubscribe(this.ton_web.provider, BlocksStorageImpl, this.onTransaction);
    }
    
    async start_fetching(){
        this.started = true
       
        try {
            await this.blockSubscribe.start(); 
        } catch (error) {
            console.log(error);
            this.started = false
        }   
    }
    get_last_block(){
        return BlocksStorageImpl.last_block
    }
    get_accouts_status(){
        return BlocksStorageImpl.day_accounts
    }
    get_blocks_rate(){
        return BlocksStorageImpl.day_blocks
    }

}

const block_monitor = new BlocksMonitor()

export {block_monitor}