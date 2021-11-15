const TonWeb = require('tonweb')
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'ws://81.30.157.98:8546');
const axios = require('axios')

class ETHBridge{
    //now tonnetwork_bridge_adress : Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r
    //now eth_bridge_adress : 0x76A797A59Ba2C17726896976B7B3747BfD1d220f
    
    constructor(tonnetwork_bridge_address='Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr', eth_bridge_address='0x582d872a1b094fc48f5de31d3b73f2d9be47def1'){
        this.tonnetwork_bridge_address = tonnetwork_bridge_address
        this.eth_bridge_address = eth_bridge_address
        this.ton_web = new TonWeb()
        
        let json = require('./contract_json.json')
        this.eth_contract = new web3.eth.Contract(json,eth_bridge_address)
    }
    // get transaction list from TON network
    async get_ton_network_transactions(limit = 20, lt = undefined, txhash = undefined, to_lt = undefined) {
       return await this.ton_web.getTransactions(this.tonnetwork_bridge_address,limit,lt,txhash,to_lt)
    }
    async get_eth_network_transactions(offset,startblock=0,apikey = '7PWNNIPH8F8HEMCI3AZIHWNUB46VICMP67',eth_address = 'https://api.etherscan.io/api'){
        //return await this.eth_contract.methods.getFullOracleSet().call()
        let transactions = await axios.get(eth_address,{
            params:{
                'module':'account',
                'action':'txlist',
                'address': this.eth_bridge_address,
                'startblock':startblock,
                'endblock':99999999,
                'page':1,
                'offset':offset,
                'sort':'asc',
                'apikey':apikey
            }
        })
        let filtered_transactions = transactions.data.result.filter(trans => trans.input.substring(0,10) == '0xe057fbff').map((trans)=>{
            let parse = web3.eth.abi.decodeParameters(
                ['uint256', 'int8', 'bytes32'],
                '0x' + trans.input.slice(10)
            )
            let addr = parse[1]+':'+parse[2].slice(2)
            return (new this.ton_web.Address(addr).toString(true, true, true, false))
        })  
        return filtered_transactions  
    }
}

module.exports = {ETHBridge}