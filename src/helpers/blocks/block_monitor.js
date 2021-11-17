const TonWeb = require('tonweb')
const {BlocksStorageImpl} = require('./block_subscribe')

class BlocksMonitor{
    started = false
    constructor(){
        this.active_accouts = {}
        this.transactions = []
        this.ton_web = new TonWeb()
        this.blockSubscribe = new this.ton_web.BlockSubscribe(this.ton_web.provider, BlocksStorageImpl, BlocksStorageImpl.on_transaction);
    }
    async subscribe(){
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
        let values = Object.values(BlocksStorageImpl.day_accounts)
        return {'count':values.length,'min_acc_date':Math.min(values)}
    }
    get_blocks_rate(){
        return BlocksStorageImpl.day_blocks
    }
    async start(){
        await this.subscribe()
        this.interval = setInterval(async () => {
            if(!this.started){
              await this.subscribe()  
            }
        }, 10000);
    }
}

const block_monitor = new BlocksMonitor()

module.exports = {block_monitor}