import {emitter} from '../../data/json_rpc_status'
import {database_config} from '../../db/dbaccess'

import TonWeb from 'tonweb'
import {known_accounts} from '../../data/known_accounts'

class BlocksStorageImpl_ {
    masterchainBlocks = {}; // mcBlockNumber {number} -> isProcessed {boolean}
    shardchainBlocks = {}; // shardId {string} + shardBlockNumber {number} -> isProcessed {boolean}

    constructor() {
        this.day_accounts = {}
        this.ton_web = new TonWeb()
        this.onTransaction = this.onTransaction.bind(this)
        this.insertBlocks = this.insertBlocks.bind(this)
        this.transactions = []
    }

    /**
     * @private
     * Insert new UNprocessed shardchain block numbers
     * Block number (shardId + shardBlockNumber) should be IGNORED if it is already in the storage
     * @param   shardBlockNumbers {[{shardId: string, shardBlockNumber: number}]}
     */
    async insertShardBlocks(shardBlockNumbers) {
        for (const {shardId, shardBlockNumber} of shardBlockNumbers) {
            if (this.shardchainBlocks[shardId + '_' + shardBlockNumber] !== undefined) continue;
            // INSERT INTO shardchainBlocks VALUES (shardId, shardBlockNumber, FALSE)
            this.shardchainBlocks[shardId + '_' + shardBlockNumber] = false;
        }
    }

    /**
     * Insert new processed masterchain block number & new UNprocessed shardchains blocks numbers
     * Must be in single DB transaction
     * @param   mcBlockNumber {number}
     * @param   shardBlockNumbers {[{shardId: string, shardBlockNumber: number}]}
     */
    async insertBlocks(mcBlockNumber, shardBlockNumbers) {
        // this.day_blocks.push(mcBlockNumber)
        
        let block = new database_config.status_conn.models.Block({
            height:mcBlockNumber,
            transactions:this.transactions,
            timestamps:new Date().getTime()
        })
        this.transactions = []
        await block.save()
        // console.log("insertBlocks",mcBlockNumber, shardBlockNumbers);
        let status = await database_config.status_conn.models.Status.findOne({})
        status.last_block=mcBlockNumber
        await status.save()
        emitter.emit('data_change',status)
        // INSERT INTO masterchainBlocks VALUES (blockNumber, TRUE)
        if (this.masterchainBlocks[mcBlockNumber] !== undefined) throw new Error('mc already exists ' + mcBlockNumber);
        this.masterchainBlocks[mcBlockNumber] = true;

        await this.insertShardBlocks(shardBlockNumbers);
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
            let direction = ''
             
            if (known_accounts[bounceble]){
                if(known_accounts[bounceble] != 'nevermind'){
                    type = known_accounts[bounceble]
                }
            }
            else if(known_accounts[tx.in_msg.source]) {
                if(known_accounts[tx.in_msg.source] != 'nevermind'){
                    type = known_accounts[tx.in_msg.source]
                }
            }
            else{
                type = 'between accounts'

            }
            if (type){
                if (tx.in_msg.destination == bounceble)
                {
                    direction = 'in'
                    // mean - money in
                }
                else{
                    direction = 'out'
                    //mean - moneu out
                    
                }
                
                this.transactions.push({
                    hash:shortTx.hash,
                    from: tx.in_msg.source,
                    to: tx.in_msg.destination,
                    type:type,
                    value:tx.in_msg.value,
                    direction:direction,
                    message:tx.in_msg.message
                })
            }
        }          
    }
    /**
     * Get last processed masterchain block number
     * @return {Promise<number | undefined>}
     */
    async getLastMasterchainBlockNumber() {
        // SELECT MAX(blockNumber) FROM masterchainBlocks
        const blockNumbers = Object.keys(this.masterchainBlocks)
            .map(x => Number(x))
            .sort((a, b) => b - a);
        return blockNumbers[0];
    }

    /**
     * Set that this shardchain block number processed & insert new UNprocessed shardchains blocks numbers
     * Must be in single DB transaction
     * @param   shardId {string}
     * @param   shardBlockNumber    {number}
     * @param   prevShardBlocks    {[{shardId: string, shardBlockNumber: number}]}
     */
    async setBlockProcessed(shardId, shardBlockNumber, prevShardBlocks) {
        //console.log("setBlockProcessed",shardId, shardBlockNumber, prevShardBlocks);
        // UPDATE shardchainBlocks SET processed = TRUE WHERE shardId = ? && shardBlockNumber = ?
        if (this.shardchainBlocks[shardId + '_' + shardBlockNumber] === undefined) throw new Error('shard not exists ' + shardId + '_' + shardBlockNumber);
        this.shardchainBlocks[shardId + '_' + shardBlockNumber] = true;

        await this.insertShardBlocks(prevShardBlocks);
    }
    
    clear_accounts(){
        for (let kv in this.day_accounts) {
            let [key,value] = kv 
            if (((new Date().getTime()-value)/(1000*60*60*24)>=1)){
                delete this.day_accounts[key]
            }
        }
    }
    /**
     * Get any unprocesed shard block number (order is not important)
     * @return {Promise<{shardId: string, shardBlockNumber: number}>}
     */
    async getUnprocessedShardBlock() {
        // SELECT shardId, shardBlockNumber from sharchainBlocks WHERE processed = FALSE LIMIT 1
        for (let key in this.shardchainBlocks) {
            if (this.shardchainBlocks[key] === false) {
                const arr = key.split('_');
                return {
                    shardId: arr[0],
                    shardBlockNumber: Number(arr[1]),
                }
            }
        }
        return undefined;
    }

}
const BlocksStorageImpl = new BlocksStorageImpl_()
export {BlocksStorageImpl}