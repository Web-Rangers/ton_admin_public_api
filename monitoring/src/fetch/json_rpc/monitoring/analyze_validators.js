const axios = require('axios')
const mysql  = require('mysql2')
const dotenv = require('dotenv')
dotenv.config();
const db_connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    port : process.env.DB_PORT,
    database: process.env.DB_NAME,
    password : process.env.DB_PASSWRD
})

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const elector_contract = "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"
const analyze_validator = async () => {
    let txs = [];
    axios.default.defaults.headers['Accept']='*/*'
    axios.default.defaults.headers['Accept-Encoding']='gzip, deflate, br'
    axios.default.defaults.headers['Connection']='keep-alive'
    axios.default.defaults.headers['User-Agent']= 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'

    db_connection.execute('SELECT * FROM status_validators',async(err,res)=>{
        for (let validator of res) {
            await delay(2000)
            try {
                let transactions = await axios.get(`https://api.ton.cat/v2/explorer/getTransactions?address=${validator.walletAddr}&limit=100&archival=false`,{timeout: 3000})
                txs = transactions.data.result
                let in_ = []
                let last_action = undefined
                if(txs.length > 0){
                    txs = txs.filter(tx=>(tx.out_msgs && tx.out_msgs[0] && tx.out_msgs[0].destination == elector_contract && tx.out_msgs[0].value/10**9 > 15) || (tx && tx.in_msg.source == elector_contract && tx.in_msg.value/10**9 > 15))
                
                    for (let tx of txs){
                        if (tx.in_msg.source == elector_contract){
                            if (last_action != 'IN'){
                                last_action='IN'
                                if (in_.length>1){
                                    let dv = in_.shift()  
                                    if (dv.val<10000){ 
                                        try {
                                            db_connection.execute(`INSERT INTO validators_history (adnlAddr,walletAddr,date,increase) VALUES('${validator.adnlAddr}','${validator.walletAddr}',${dv.date},${dv.val}) ON DUPLICATE KEY UPDATE increase=${dv.val}`)      
                                        } catch (error) {
                                            console.log('continueeeeeeeee');
                                            break
                                        }
                                    }   
                                }
                                in_.push({date:tx.utime,val:tx.in_msg.value/(10**9)})
                            }
                        }
                        else if (tx.out_msgs&&tx.out_msgs[0]&&tx.out_msgs[0].destination == elector_contract){
                            last_action='OUT'
                            if (in_.length>1){ 
                                in_[0].val-= tx.out_msgs[0].value/(10**9)
                            }               
                        }
                    }      
                } 
            } catch (error) {
                continue
            }
        }
    })
}
analyze_validator()