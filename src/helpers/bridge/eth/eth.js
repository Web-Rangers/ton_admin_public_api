const TonWeb = require('tonweb')
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'ws://81.30.157.98:8546');
const axios = require('axios')
//in minutes
const CHECKEDPERIOD = 15

class ETHBridge{
    //now tonnetwork_bridge_adress : Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r
    //now eth_bridge_adress : 0x76A797A59Ba2C17726896976B7B3747BfD1d220f
    
    constructor(tonnetwork_bridge_address='Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr', eth_bridge_address='0x582d872a1b094fc48f5de31d3b73f2d9be47def1'){
        let json = require('./contract_json.json')
        this.eth_contract = new web3.eth.Contract(json,eth_bridge_address)
        this.tonnetwork_bridge_address = tonnetwork_bridge_address
        this.eth_bridge_address = eth_bridge_address
        this.ton_web = new TonWeb()
        this.eth_transactions_history=[]
        this.ton_transactions_history=[]
        this.eth_timeouts = []
        this.ton_timeouts = []
        this.ton_out = {}
        this.eth_out = {} 
    }
    add_ton_out_transaction(adress,timestamp){
        let diff = Math.abs(new Date()-new Date(timestamp*1000))/(1000*60)
        if (diff<CHECKEDPERIOD){
            if (!this.ton_out[adress])this.ton_out[adress]=[]     
            if (!this.ton_out[adress].includes(timestamp)&&!this.ton_transactions_history.includes(timestamp)){
                this.ton_transactions_history.push(timestamp)
                this.ton_out[adress].push(timestamp)
            }     
        }
        
    }

    add_eth_out_transaction(adress,timestamp){
        let diff = Math.abs(new Date()-new Date(timestamp*1000))/(1000*60)
        if (diff<CHECKEDPERIOD){
            if (!this.eth_out[adress])this.eth_out[adress]=[] 
            if (!this.eth_out[adress].includes(timestamp)&&!this.eth_transactions_history.includes(timestamp)){
                this.eth_transactions_history.push(timestamp)
                this.eth_out[adress].push(timestamp)
            }
        }      
    }
    // get transaction list from TON network
    async calc_ton_network_transactions(limit = 10, lt = undefined, txhash = undefined, to_lt = undefined) 
    {
        try
        {
            let transactions = await this.ton_web.getTransactions(this.tonnetwork_bridge_address,limit,lt,txhash,to_lt)
            for (let iterator of transactions) {
                if (iterator.in_msg.message.includes('swapTo')){
                    this.add_ton_out_transaction(iterator.in_msg.message.slice(7).toLowerCase(),iterator.utime)
                }
                else{
                    let adress = iterator.out_msgs[0].destination.toLowerCase()
                    if (this.eth_out[adress]&&!this.ton_timeouts.includes(iterator.utime)){this.ton_timeouts.push(iterator.utime);this.eth_out[adress].shift()}
                }
            }
            return transactions
        }
        catch(error)
        {
            return undefined
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
        
            for (const trans of transactions.data.result.filter(trans => trans.input.substring(0,10) == '0x4054b92b')) {
                let from = trans.from.toLowerCase()
                if (this.ton_out[from]&&!this.eth_timeouts.includes(trans.utime)){
                    this.eth_timeouts.push(trans.utime)
                    this.ton_out[from].shift()
                }
            }
            let eth_out = transactions.data.result.filter(trans => trans.input.substring(0,10) == '0xe057fbff')
            for (const trans of eth_out) {
                let parse = web3.eth.abi.decodeParameters(['uint256', 'int8', 'bytes32'],'0x' + trans.input.slice(10))
                this.add_eth_out_transaction(new this.ton_web.Address(parse[1]+':'+parse[2].slice(2)).toString(true, true, true, false).toLowerCase(),trans.timeStamp)
            }
        } catch (error) {
            return undefined
        }
            
        return transactions  
    }
    is_alive(){
        for (const iterator of Object.entries(this.ton_out)) {
            let [key,val] = iterator
            let ton_check = val.find(x=>Math.abs((new Date()-new Date(x*1000))/(1000*60))>CHECKEDPERIOD)
            if (ton_check) return false
            
        }
        for (const iterator of Object.entries(this.eth_out)) {
            let [key,val] = iterator
            let eth_check = val.find(x=>Math.abs((new Date()-new Date(x*1000))/(1000*60))>CHECKEDPERIOD)
            if (eth_check) return false
        }
        return true
    }
}

module.exports = {ETHBridge}