
import TonWeb from 'tonweb'
import db_connection from '../../db/dbaccess/async_connection'
import {emitter} from '../../data/json_rpc_status'
const ton_web = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'))
const {exec } = require('child_process')

const onBlock = async (blockHeader) => { 
    console.log(blockHeader.id.seqno);
    await db_connection.connection.execute(`UPDATE status SET last_block = ${blockHeader.id.seqno}`)
    emitter.emit('data_change',{'last_block':blockHeader.id.seqno})
    exec(`node ${__dirname}/fetch_block_transactions.js --chain:${blockHeader.id.workchain} --shard:${blockHeader.id.shard} --seqno:${blockHeader.id.seqno}`,(err,s,se)=>{
        console.log(err,s,se);
    }) 
}

class BlocksMonitor{
    started = false
    constructor(){
        this.active_accouts = {}
        this.transactions = []
        const storage = new TonWeb.InMemoryBlockStorage();
        this.blockSubscribe = new TonWeb.BlockSubscription(ton_web.provider, storage, onBlock);
    }
    
    async start_fetching(){
        this.started = true
       
        try {
            await this.blockSubscribe.start();
        } catch (error) {
            console.log(error);
            // this.started = false
        }   
    }
}

const block_monitor = new BlocksMonitor()

export {block_monitor}