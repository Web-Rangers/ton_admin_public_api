import TonWeb from 'tonweb'
import Web3 from 'web3'
const web3 = new Web3(Web3.givenProvider || 'ws://81.30.157.98:8546');
import axios from 'axios'
import db_connection from '../../../db/dbaccess/async_connection'
import InputDataDecoder from 'ethereum-input-data-decoder'
//in minutes
const CHECKEDPERIOD = 15
let bridge_ton_name = 'TONE'
let bridge_noton_name = 'ETH'
class ETHBridge{
    //now tonnetwork_bridge_adress : Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r
    //now eth_bridge_adress : 0x76A797A59Ba2C17726896976B7B3747BfD1d220f
    
    constructor(tonnetwork_bridge_address='Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr', eth_bridge_address='0x582d872a1b094fc48f5de31d3b73f2d9be47def1'){
        const json = require('./contract_json.json')
        this.eth_contract = new web3.eth.Contract(json,eth_bridge_address)
        this.decoder = new InputDataDecoder(json);
        this.tonnetwork_bridge_address = tonnetwork_bridge_address
        this.eth_bridge_address = eth_bridge_address
        this.ton_web = new TonWeb() 
    }
    
    // get transaction list from TON network
    async calc_ton_network_transactions(limit = 10, lt = undefined, txhash = undefined, to_lt = undefined) 
    {
        try
        {
            let headers = {
                'Accept':'*/*',
                'Accept-Encoding':'gzip, deflate, br',
                'Connection':'keep-alive',
                'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'
            }
            let transactions = await axios.get(`https://api.ton.cat/v2/explorer/getTransactions?address=${this.tonnetwork_bridge_address}&limit=${limit}&lo_lt=0&archival=false`,{headers:headers})
            transactions = transactions.data.result
            for (let iterator of transactions) {
                if (iterator.in_msg.message.includes('swapTo#')){
                    await db_connection.connection.execute(`insert into status_bridge (addr_from,addr_to,value,time,bridge_name,direction,status) values('${iterator.in_msg.source}','${iterator.in_msg.message.slice(7).toLowerCase()}',${iterator.in_msg.value/10**9},${iterator.utime},'${bridge_ton_name}','OUT','pending')`)
                }
                else if(iterator.in_msg.message.includes('swapTo%')){
                    await db_connection.connection.execute(`insert into status_bridge (addr_from,addr_to,value,time,bridge_name,direction,status) values('${iterator.in_msg.source}','${iterator.in_msg.message.slice(7).toLowerCase()}',${iterator.in_msg.value/10**9},${iterator.utime},'${bridge_ton_name}','OUT','reject')`)
                }
                else{
                    if(iterator.out_msgs.length>0){
                        let adress = iterator.out_msgs[0].destination
                        let bsc_addr_transactions = await async_connection.connection.execute(`select * from status_bridge where bridge_name='${bridge_noton_name}' and addr_to='${adress}' and status = 'pending'`)
                        if (bsc_addr_transactions[0].length>0){
                            let transaction = bsc_addr_transactions[0][bsc_addr_transactions[0].length-1]
                            console.log(transaction);
                            db_connection.connection.execute(`insert into status_bridge (addr_from,addr_to,value,time,bridge_name,direction,status) values('${transaction.addr_from}','${transaction.addr_to}',${iterator.out_msgs[0].value/10**9},${iterator.utime},'${bridge_ton_name}','IN','')`)
                            .then(async(res)=>{
            
                                await db_connection.connection.execute(`update status_bridge set status ='sucess' where bridge_name='${bridge_noton_name}' and addr_to='${adress}' and status = 'pending' and time=${transaction.time}`)
                            })
                        }   
                    }  
                }
            }
        }
        catch(error)
        {
            console.log("Ton(eth) bridge error:\n");
            console.log(error);
        }
    }
    async calc_eth_network_transactions(offset=100,startblock=0,apikey='7PWNNIPH8F8HEMCI3AZIHWNUB46VICMP67',eth_address = 'https://api.etherscan.io/api'){
        //return await this.eth_contract.methods.getFullOracleSet().call()
        try {
        let transactions = await axios.get(eth_address,{
            params:{
                'module':'account',
                'action':'txlist',
                'address': this.eth_bridge_address,
                'startblock':startblock,
                'endblock':99999999,
                'page':1,
                'offset':offset,
                'sort':'desc',
                'apikey':apikey
            }
        }) 
            for (let trans of transactions.data.result.filter(trans => trans.input.substring(0,10) == '0x4054b92b')) {
                let parse = this.decoder.decodeData(trans.input)
                let value = Number(parse.inputs[0][1]._hex)/10**9;
                let ton_addr_transactions = await async_connection.connection.execute(`select * from status_bridge where bridge_name='${bridge_ton_name}' and addr_to='${trans.from.toLowerCase()}' and status = 'pending'`)
                if (ton_addr_transactions[0].length>0){
                    let transaction = ton_addr_transactions[0][ton_addr_transactions[0].length-1]
                    db_connection.connection.execute(`insert into status_bridge (addr_from,addr_to,value,time,bridge_name,direction,status) values('${transaction.addr_from}','${transaction.addr_to}',${value},${trans.timeStamp},'${bridge_noton_name}','IN','')`)
                    .then(async(res)=>{
                        await db_connection.connection.execute(`update status_bridge set status ='sucess' where bridge_name='${bridge_ton_name}' and addr_to='${transaction.addr_to}' and status = 'pending' and time=${transaction.time}`)
                    })
                }    
            }
            let bsc_out = transactions.data.result.filter(trans => trans.input.substring(0,10) == '0xe057fbff')
            for (let trans of bsc_out) {
                let input = this.decoder.decodeData(trans.input)
                let value = Number(input.inputs[0]._hex)/10**9;
                let addr = new this.ton_web.Address('-1:'+input.inputs[1][1].slice(2)).toString(true, true, true, false)
                console.log(addr);
                await db_connection.connection.execute(`insert into status_bridge (addr_from,addr_to,value,time,bridge_name,direction,status) values('${trans.from.toLowerCase()}','${addr}',${value},${trans.timeStamp},'${bridge_noton_name}','OUT','pending')`)
            
            }
        } catch (error) {
            console.log("ETH bridge error:\n");
            console.log(error);
        } 
    }
}

export {ETHBridge}