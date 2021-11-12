"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.sort.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BlocksStorageImpl {
  // mcBlockNumber {number} -> isProcessed {boolean}
  // shardId {string} + shardBlockNumber {number} -> isProcessed {boolean}
  constructor() {
    _defineProperty(this, "masterchainBlocks", {});

    _defineProperty(this, "shardchainBlocks", {});
  }
  /**
   * @private
   * Insert new UNprocessed shardchain block numbers
   * Block number (shardId + shardBlockNumber) should be IGNORED if it is already in the storage
   * @param   shardBlockNumbers {[{shardId: string, shardBlockNumber: number}]}
   */


  async insertShardBlocks(shardBlockNumbers) {
    for (const {
      shardId,
      shardBlockNumber
    } of shardBlockNumbers) {
      if (this.shardchainBlocks[shardId + '_' + shardBlockNumber] !== undefined) continue; // INSERT INTO shardchainBlocks VALUES (shardId, shardBlockNumber, FALSE)

      console.log('insert shard ' + shardId + ' ' + shardBlockNumber);
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
    console.log('mc processed ' + mcBlockNumber); // INSERT INTO masterchainBlocks VALUES (blockNumber, TRUE)

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
    const blockNumbers = Object.keys(this.masterchainBlocks).map(x => Number(x)).sort((a, b) => b - a);
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
    console.log('shard processed ' + shardId + ' ' + shardBlockNumber); // UPDATE shardchainBlocks SET processed = TRUE WHERE shardId = ? && shardBlockNumber = ?

    if (this.shardchainBlocks[shardId + '_' + shardBlockNumber] === undefined) throw new Error('shard not exists ' + shardId + '_' + shardBlockNumber);
    this.shardchainBlocks[shardId + '_' + shardBlockNumber] = true;
    await this.insertShardBlocks(prevShardBlocks);
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
          shardBlockNumber: Number(arr[1])
        };
      }
    }

    return undefined;
  }

}

exports.default = BlocksStorageImpl;