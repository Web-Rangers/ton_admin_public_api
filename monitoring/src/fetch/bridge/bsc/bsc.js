import TonWeb from 'tonweb'
import Web3 from 'web3'
const web3 = new Web3(Web3.givenProvider || 'wss://speedy-nodes-nyc.moralis.io/b6e921da0c20b0b94b5a8f61/bsc/mainnet/ws');
import axios from 'axios'
//in minutes
import db_connection from '../../../db/dbaccess/db_connection'
import async_connection from '../../../db/dbaccess/async_connection'
import InputDataDecoder from 'ethereum-input-data-decoder'
const CHECKEDPERIOD = 15

class BSCBridge{
    //now tonnetwork_bridge_adress : Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r
    //now bsc_bridge_adress : 0x76A797A59Ba2C17726896976B7B3747BfD1d220f
    
    constructor(tonnetwork_bridge_adress='Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r', bsc_bridge_adress='0x76A797A59Ba2C17726896976B7B3747BfD1d220f'){
        const json = require('./contract_json.json')
        this.bsc_contract = new web3.eth.Contract(json,bsc_bridge_adress)
        this.tonnetwork_bridge_adress = tonnetwork_bridge_adress
        this.decoder = new InputDataDecoder(json);
        this.bsc_bridge_adress = bsc_bridge_adress
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
            let transactions = await axios.get(`https://api.ton.cat/v2/explorer/getTransactions?address=${this.tonnetwork_bridge_adress}&limit=${limit}&lo_lt=0&archival=true`,{headers:headers})
            transactions = transactions.data.result
            for (let iterator of transactions) {
                if (iterator.in_msg.message.includes('swapTo#')){
                    db_connection.connection.execute(`insert into status_bridge (addr_from,addr_to,value,time,bridge_name,direction,status) values('${iterator.in_msg.source}','${iterator.in_msg.message.slice(7).toLowerCase()}',${iterator.in_msg.value/10**9},${iterator.utime},'TONB','OUT','pending')`,(err,res)=>{if(err)return})
                }
                else if(iterator.in_msg.message.includes('swapTo%')){
                    db_connection.connection.execute(`insert into status_bridge (addr_from,addr_to,value,time,bridge_name,direction,status) values('${iterator.in_msg.source}','${iterator.in_msg.message.slice(7).toLowerCase()}',${iterator.in_msg.value/10**9},${iterator.utime},'TONB','OUT','reject')`,(err,res)=>{if(err)return})
                }
                else{
                    if(iterator.out_msgs.length>0){
                        let adress = iterator.out_msgs[0].destination
                        console.log(adress);
                        let bsc_addr_transactions = await async_connection.connection.execute(`select * from status_bridge where bridge_name='BSC' and addr_to='${adress}' and status = 'pending'`)
                        console.log(bsc_addr_transactions[0].length);
                        if (bsc_addr_transactions[0].length>0){
                            let transaction = bsc_addr_transactions[0][bsc_addr_transactions[0].length-1]
                            console.log(transaction);
                            db_connection.connection.execute(`insert into status_bridge (addr_from,addr_to,value,time,bridge_name,direction,status) values('${transaction.addr_from}','${transaction.addr_to}',${iterator.out_msgs[0].value/10**9},${iterator.utime},'TONB','IN','')`,(err,res)=>{
                                if (err) return
                                db_connection.connection.execute(`update status_bridge set status ='sucess' where bridge_name='BSC' and addr_to='${adress}' and status = 'pending' and time=${transaction.time}`)
                            })
                        }   
                    }  
                }
            }    
        }
        catch(error)
        {
            console.log("Ton(bsc) bridge error:\n");
            console.log(error);
        }
    }
    async calc_bsc_network_transactions(offset=100,startblock=0,apikey = 'SRXAIJ7ZR1UT2PCP96MC39C31J4D1WMNKG',bsc_adress = 'https://api.bscscan.com/api'){
        try {    
                let transactions = await axios.get(bsc_adress,{
                        params:{
                            'module':'account',
                            'action':'txlist',
                            'address': this.bsc_bridge_adress,
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
                    let ton_addr_transactions = await async_connection.connection.execute(`select * from status_bridge where bridge_name='TONB' and addr_to='${trans.from.toLowerCase()}' and status = 'pending'`)
                    if (ton_addr_transactions[0].length>0){
                        let transaction = ton_addr_transactions[0][ton_addr_transactions[0].length-1]
                        db_connection.connection.execute(`insert into status_bridge (addr_from,addr_to,value,time,bridge_name,direction,status) values('${transaction.addr_from}','${transaction.addr_to}',${value},${trans.timeStamp},'BSC','IN','')`,(err,res)=>{
                            if (err) return
                            db_connection.connection.execute(`update status_bridge set status ='sucess' where bridge_name='TONB' and addr_to='${transaction.addr_to}' and status = 'pending' and time=${transaction.time}`)
                        })
                    }    
                }
                let bsc_out = transactions.data.result.filter(trans => trans.input.substring(0,10) == '0xe057fbff')
                for (let trans of bsc_out) {
                    let input = this.decoder.decodeData(trans.input)
                    let value = Number(input.inputs[0]._hex)/10**9;
                    let addr = new this.ton_web.Address('-1:'+input.inputs[1][1].slice(2)).toString(true, true, true, false)
                    db_connection.connection.execute(`insert into status_bridge (addr_from,addr_to,value,time,bridge_name,direction,status) values('${trans.from.toLowerCase()}','${addr}',${value},${trans.timeStamp},'BSC','OUT','pending')`,(err,res)=>{if(err)return})
                
                }
            } catch (error) {
                console.log("Bsc bridge error:\n");
                console.log(error);
            }
    }
}

export {BSCBridge}