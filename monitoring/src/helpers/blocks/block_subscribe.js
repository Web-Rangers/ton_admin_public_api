import {emitter} from '../../data/json_rpc_status'
import {known_accounts} from '../../data/known_accounts'
import db_connection from '../../db/dbaccess/db_connection';
import axios from "axios";

class BlocksStorageImpl_ {
    masterchainBlocks = {}; // mcBlockNumber {number} -> isProcessed {boolean}
    shardchainBlocks = {}; // shardId {string} + shardBlockNumber {number} -> isProcessed {boolean}

    constructor() {
        this.day_accounts = {}
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

        let time = Math.round(new Date().getTime()/1000)
        let insert_str = ``
        
        for (let transaction of this.transactions) {
            if (insert_str==''){
                insert_str+=`('${transaction.from}','${transaction.hash}','${transaction.to}','${transaction.type}','${transaction.direction}',${mcBlockNumber},${transaction.value},${time})`
                continue
            }
            insert_str+=`,('${transaction.from}','${transaction.hash}','${transaction.to}','${transaction.type}','${transaction.direction}',${mcBlockNumber},${transaction.value},${time})`    
        }
        this.transactions = []
        
        db_connection.connection.execute(`UPDATE status SET last_block = ${mcBlockNumber}`)
        
        try{
            if (insert_str.length>0){
                db_connection.connection.execute(`INSERT INTO status_transactions (from_ ,hash ,to_ ,type ,direction ,block_height,value ,time) VALUES ${insert_str}`)
            }
        }
        catch (e){
            console.log(insert_str);
        }
        emitter.emit('data_change',{'last_block':mcBlockNumber})
        // INSERT INTO masterchainBlocks VALUES (blockNumber, TRUE)
        if (this.masterchainBlocks[mcBlockNumber] !== undefined) throw new Error('mc already exists ' + mcBlockNumber);
        this.masterchainBlocks[mcBlockNumber] = true;

        await this.insertShardBlocks(shardBlockNumbers);
    }
    
    async onTransaction(shortTx){
        let address = shortTx.account;
        
        let bounceble = new TonWeb.Address(address).toString(true,true,true,false)
        let timestamp = Math.round(new Date().getTime()/1000)
        let headers = {
            'Accept':'*/*',
            'Accept-Encoding':'gzip, deflate, br',
            'Connection':'keep-alive',
            'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'
          }
        let txs = await axios.get(`https://wallet.toncenter.com/api/v2/getTransactions?address=${bounceble}&limit=4&lo_lt=0&archival=false`,{headers:headers})
          
        const tx = txs[0];
        
        if (tx&&tx.in_msg) {
            console.log(tx);
            let type = ''
            let direction = ''
            if (tx.in_msg.value!=0){
                if (known_accounts[bounceble]){
                    type = known_accounts[bounceble]
                }
                else if(known_accounts[tx.in_msg.source]) {
                    type = known_accounts[tx.in_msg.source]
                }
                else{
                    type = 'between_accounts'
    
                }
                if (type == 'between_accounts'){
                    db_connection.connection.execute(`INSERT INTO status_account_activity (account,time) values ('${bounceble}',${timestamp}) ON DUPLICATE KEY UPDATE time=${timestamp}`)
                    db_connection.connection.execute(`DELETE FROM status_account_activity WHERE time<${timestamp-60*60*24}`)
                }
                if (type){
                    if (tx.in_msg.destination == bounceble)
                    {
                        direction = 'out'
                        // mean - money out
                    }
                    else{
                        direction = 'in'
                        //mean - moneu in  
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