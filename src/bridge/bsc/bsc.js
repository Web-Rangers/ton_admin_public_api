const TonWeb = require('tonweb')
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'wss://speedy-nodes-nyc.moralis.io/b6e921da0c20b0b94b5a8f61/bsc/mainnet/ws');
const axios = require('axios')

class BSCBridge{
    //now tonnetwork_bridge_adress : Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r
    //now bsc_bridge_adress : 0x76A797A59Ba2C17726896976B7B3747BfD1d220f
    
    constructor(tonnetwork_bridge_adress='Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r', bsc_bridge_adress='0x76A797A59Ba2C17726896976B7B3747BfD1d220f'){
        this.tonnetwork_bridge_adress = tonnetwork_bridge_adress
        this.bsc_bridge_adress = bsc_bridge_adress
        this.ton_web = new TonWeb()
        this.ton_out = {}
        this.bsc_out = {}
        let json = require('./contract_json.json')
        this.bsc_contract = new web3.eth.Contract(json,bsc_bridge_adress)
    }
    // get transaction list from TON network
    async get_ton_network_transactions(limit = 10, lt = undefined, txhash = undefined, to_lt = undefined) {
        let transactions = await this.ton_web.getTransactions(this.tonnetwork_bridge_adress,limit,lt,txhash,to_lt)
        for (let iterator of transactions) {
            let msg_data = iterator.in_msg
            if (msg_data.message.includes('swapTo')){
                let adress = msg_data.message.slice(7).toLowerCase()
                if (!this.ton_out[adress] ){
                    this.ton_out[adress] = []
                }
                if (!this.ton_out[adress].some(x=>x.timestamp==iterator.utime))
                    var func = setTimeout(()=>{console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa');},1000*60*15)
                    var element = {'timestamp':iterator.utime,'timeout':func}
                    this.ton_out[adress].push(element)
            }
            else{
                let addr = iterator.out_msgs[0].destination.toLowerCase()
                if (this.bsc_out[addr]){
                    let timeout = this.bsc_out[addr].reverse().find(x=>x.timeout)
                    if (Boolean(timeout))
                        console.log(timeout);
                        clearTimeout(timeout.timeout)
                        timeout.timeout = undefined
                }
            }
        }
        return this.transactions_in
    }
    async get_bsc_network_transactions(offset=20,startblock=0,apikey = 'SRXAIJ7ZR1UT2PCP96MC39C31J4D1WMNKG',bsc_adress = 'https://api.bscscan.com/api'){
        //return await this.bsc_contract.methods.getFullOracleSet().call()
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

        //||(trans.input.substring(0,10)=='0x4054b92b')
        let in_transactions = transactions.data.result.filter(trans => trans.input.substring(0,10) == '0x4054b92b').map((trans)=>{
            let from = trans.from.toLowerCase()
            if (this.ton_out[from]){
                let timeout = this.ton_out[from].reverse().find(x=>x.timeout) 
                if (Boolean(timeout))
                    console.log(timeout);
                    clearTimeout(timeout.timeout)
                    timeout.timeout = undefined
            }
            return trans.from
        }) 
        let out_transactions = transactions.data.result.filter(trans => trans.input.substring(0,10) == '0xe057fbff').map((trans)=>{
            let parse = web3.eth.abi.decodeParameters(
                ['uint256', 'int8', 'bytes32'],
                '0x' + trans.input.slice(10)
            )
            let addr = parse[1]+':'+parse[2].slice(2)
            addr = new this.ton_web.Address(addr).toString(true, true, true, false).toLowerCase()
            if (!this.bsc_out[addr]){
                this.bsc_out[addr]=[]
            }
            if (!this.bsc_out[addr].some(x=>x.timestamp==trans.timeStamp)){
                var func = setTimeout(()=>{console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa');},1000*60*15)
                this.bsc_out[addr].push({'timeout':func,'timestamp':trans.timeStamp})
            }
            
            return addr
        })  
        
        return out_transactions 
    }
}

module.exports = {BSCBridge}