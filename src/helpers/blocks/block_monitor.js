const TonWeb = require('tonweb')
const {BlocksStorageImpl} = require('./block_subscribe')
let {known_accounts} = require('../../data/known_accounts')
class BlocksMonitor{
    started = false
    constructor(){
        this.active_accouts = {}
        this.transactions = []
        this.ton_web = new TonWeb()
        this.onTransaction = this.onTransaction.bind(this)
        
        this.blockSubscribe = new this.ton_web.BlockSubscribe(this.ton_web.provider, BlocksStorageImpl, this.onTransaction);
    }
    async onTransaction(shortTx){
        let address = shortTx.account;
        let bounceble = new this.ton_web.Address(address).toString(true,true,true,false)
        let lt = shortTx.lt 
        let hash = undefined
        let limit = 20
        let to_lt = undefined
        const txs = await this.ton_web.provider.send("getTransactions", {address, limit, lt, hash, to_lt});
        const tx = txs[0];
        if (tx&&tx.in_msg) {
            let type = ''
            if (known_accounts[bounceble]){
                if(known_accounts[bounceble] != 'nevermind'){
                    type = known_accounts[bounceble]
                }
            }
            else{
                type = 'between accounts'
            }
            if (tx.in_msg.destination == bounceble)
            {
                let value = tx.in_msg.value
                // mean - money in
            }
            else{
                //mean - moneu out
                
            }
        }          
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

module.exports = {block_monitor}