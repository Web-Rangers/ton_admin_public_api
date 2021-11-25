const TonWeb = require('tonweb')
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'wss://speedy-nodes-nyc.moralis.io/b6e921da0c20b0b94b5a8f61/bsc/mainnet/ws');
const axios = require('axios')
//in minutes
const CHECKEDPERIOD = 15



class BSCBridge{
    //now tonnetwork_bridge_adress : Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r
    //now bsc_bridge_adress : 0x76A797A59Ba2C17726896976B7B3747BfD1d220f
    
    constructor(tonnetwork_bridge_adress='Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r', bsc_bridge_adress='0x76A797A59Ba2C17726896976B7B3747BfD1d220f'){
        let json = require('./contract_json.json')
        this.bsc_contract = new web3.eth.Contract(json,bsc_bridge_adress)
        this.tonnetwork_bridge_adress = tonnetwork_bridge_adress
        this.bsc_bridge_adress = bsc_bridge_adress
        this.ton_web = new TonWeb()
        this.bsc_transactions_history=[]
        this.ton_transactions_history=[]
        this.bsc_timeouts = []
        this.ton_timeouts = []
        this.ton_out = {}
        this.bsc_out = {} 
    }

    add_ton_out_transaction(adress,timestamp){
        let diff = Math.abs(new Date()-new Date(timestamp*1000))/(1000*60)
        if (diff<CHECKEDPERIOD){
            if (!this.ton_out[adress])this.ton_out[adress]=[]
            if(!this.ton_out[adress].includes(timestamp)&&!this.ton_transactions_history.includes(timestamp)){
                this.ton_transactions_history.push(timestamp)
                this.ton_out[adress].push(timestamp)
            }         
        }
    }

    add_bsc_out_transaction(adress,timestamp){
        let diff = Math.abs(new Date()-new Date(timestamp*1000))/(1000*60)
        if (diff<CHECKEDPERIOD){
            if (!this.bsc_out[adress])this.bsc_out[adress]=[]  
            if (!this.bsc_out[adress].includes(timestamp)&&!this.bsc_transactions_history.includes(timestamp))
            {
                this.bsc_transactions_history.push(timestamp)
                this.bsc_out[adress].push(timestamp)
            }
        }        
    }
    // get transaction list from TON network
    async calc_ton_network_transactions(limit = 10, lt = undefined, txhash = undefined, to_lt = undefined) 
    {
        try
        {
            let transactions = await this.ton_web.getTransactions(this.tonnetwork_bridge_adress,limit,lt,txhash,to_lt)
            for (let iterator of transactions) {
                if (iterator.in_msg.message.includes('swapTo')){
                    this.add_ton_out_transaction(iterator.in_msg.message.slice(7).toLowerCase(),iterator.utime)
                }
                else{
                    if(iterator.out_msgs.length>0){
                        let adress = iterator.out_msgs[0].destination.toLowerCase()
                        if (this.bsc_out[adress]&&!this.ton_timeouts.includes(iterator.utime)){
                            this.ton_timeouts.push(iterator.utime)
                            this.bsc_out[adress].shift()
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
            
                for (const trans of transactions.data.result.filter(trans => trans.input.substring(0,10) == '0x4054b92b')) {
                    let from = trans.from.toLowerCase()
                    if (this.ton_out[from]&&!this.bsc_timeouts.includes(trans.timeStamp)){
                        this.bsc_timeouts.push(trans.timeStamp)
                        this.ton_out[from].shift()
                    }
                }
                let bsc_out = transactions.data.result.filter(trans => trans.input.substring(0,10) == '0xe057fbff')
                for (const trans of bsc_out) {
                    let parse = web3.eth.abi.decodeParameters(['uint256', 'int8', 'bytes32'],'0x' + trans.input.slice(10))
                    this.add_bsc_out_transaction(new this.ton_web.Address(parse[1]+':'+parse[2].slice(2)).toString(true, true, true, false).toLowerCase(),trans.timeStamp)
                }
            } catch (error) {
                console.log("Bsc bridge error:\n");
                console.log(error);
            }
    }
    is_alive(){
        for (const iterator of Object.entries(this.ton_out)) {
            let [key,val] = iterator
            let ton_check = val.find(x=>Math.abs((new Date()-new Date(x*1000))/(1000*60))>CHECKEDPERIOD)
            
            if (ton_check) return false
             
        }
        for (const iterator of Object.entries(this.bsc_out)) {
            let [key,val] = iterator
            let bsc_check = val.find(x=>Math.abs((new Date()-new Date(x*1000))/(1000*60))>CHECKEDPERIOD)
            
            if (bsc_check) return false
        }
        
        return true
    }
}

module.exports = {BSCBridge}