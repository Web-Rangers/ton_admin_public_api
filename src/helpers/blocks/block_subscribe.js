
class BlocksStorageImpl_ {
    masterchainBlocks = {}; // mcBlockNumber {number} -> isProcessed {boolean}
    shardchainBlocks = {}; // shardId {string} + shardBlockNumber {number} -> isProcessed {boolean}

    constructor() {
        this.on_transaction = this.on_transaction.bind(this)
        this.day_blocks = []
        
        this.day_accounts = {}
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
        this.day_blocks.push(mcBlockNumber)
        // INSERT INTO masterchainBlocks VALUES (blockNumber, TRUE)
        if (this.masterchainBlocks[mcBlockNumber] !== undefined) throw new Error('mc already exists ' + mcBlockNumber);
        this.masterchainBlocks[mcBlockNumber] = true;

        await this.insertShardBlocks(shardBlockNumbers);
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
        // UPDATE shardchainBlocks SET processed = TRUE WHERE shardId = ? && shardBlockNumber = ?
        if (this.shardchainBlocks[shardId + '_' + shardBlockNumber] === undefined) throw new Error('shard not exists ' + shardId + '_' + shardBlockNumber);
        this.shardchainBlocks[shardId + '_' + shardBlockNumber] = true;

        await this.insertShardBlocks(prevShardBlocks);
    }
    on_transaction(shortTx){
        var timestamp = new Date().getTime()/1000;
        if (!this.day_accounts[shortTx.account]){
            this.day_accounts[shortTx.account]=timestamp;
        }
        else{
            this.day_accounts[shortTx.account]=timestamp
        }
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
module.exports = {BlocksStorageImpl}