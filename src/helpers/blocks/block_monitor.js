const TonWeb = require('tonweb')
const {BlocksStorageImpl} = require('./block_subscribe')

class BlocksMonitor{
    constructor(){
        this.active_accouts = {}
        this.transactions = []
        this.ton_web = new TonWeb()
        
        this.ton_web.getTransactions
    }
    async start(){
        const storage = new BlocksStorageImpl();
        const blockSubscribe = new this.ton_web.BlockSubscribe(this.ton_web.provider, storage, this.calc_blocks);
        
        await blockSubscribe.start();
    }
    calc_blocks(shortTx){
       console.log(shortTx);
    }
}

const block_monitor = new BlocksMonitor()

module.exports = {block_monitor}