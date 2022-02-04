const axios = require('axios')
const mysql  = require('mysql2')
const dotenv = require('dotenv')
const TonWeb = require('tonweb');
dotenv.config();
const tonweb = new TonWeb()
const db_connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    port : process.env.DB_PORT,
    database: process.env.DB_NAME,
    password : process.env.DB_PASSWRD,
})
const elector_contract = "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const analyze_validator = async () => {
    // let tonweb = new TonWeb(new TonWeb.HttpProvider('https://wallet.toncenter.com/api/v2/'))
    db_connection.execute('SELECT * FROM status_validators',async(err,res)=>{
        let txs = [];
        axios.default.defaults.headers['Accept']='*/*'
        axios.default.defaults.headers['Accept-Encoding']='gzip, deflate, br'
        axios.default.defaults.headers['Connection']='keep-alive'
        axios.default.defaults.headers['User-Agent']= 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'
        for (let validator of res) {
            let lt = 0 
            let hash = ''
            let in_ = []
            let last_action = undefined
            let len = 0
            await delay(1000)
            console.log(validator.walletAddr);
            do{
                let transactions
                try {
                    transactions = await axios.get(`https://api.ton.cat/v2/explorer/transactions?address=${validator.walletAddr}&limit=1000${lt==0?'':`&lt=${lt}`}&hash=${hash}&archival=false`,{timeout: 3000})
                } catch (error) {
                    console.log('errrrr');
                    await delay(1000)
                    len = 2
                    continue
                }       
                if (!transactions.data.result){
                    console.log(transactions.data);
                    break
                }
                txs = transactions.data.result
                len = txs.length
                if(txs.length > 0){
                    lt  = Number(txs[txs.length-1].transaction_id.lt)
                    hash = tonweb.utils.bytesToHex(tonweb.utils.base64ToBytes(txs[txs.length-1].transaction_id.hash))
                    txs = txs.filter(tx=>(tx.out_msgs && tx.out_msgs[0] && tx.out_msgs[0].destination == elector_contract && tx.out_msgs[0].value/10**9 > 15) || (tx && tx.in_msg.source == elector_contract && tx.in_msg.value/10**9 > 15))
                    if (txs.length==0){
                        continue
                    } 
                   
                    for (tx of txs){
                        if (tx.in_msg.source == elector_contract){
                            if (last_action != 'IN'){
                                last_action='IN'
                                if (in_.length>1){
                                    let dv = in_.shift()  
                                    if (dv.val<10000){ 
                                        db_connection.execute(`INSERT INTO validators_history (adnlAddr,walletAddr,date,increase) VALUES('${validator.adnlAddr}','${validator.walletAddr}',${dv.date},${dv.val}) ON DUPLICATE KEY UPDATE increase=${dv.val};`)      
                                    }   
                                }
                                in_.push({date:tx.utime,val:tx.in_msg.value/(10**9)})
                                db_connection.execute(`INSERT IGNORE INTO validators_cycle_history (date_start,date_end) VALUES (${tx.utime},${tx.utime+(60*60*18)})`)
                                db_connection.execute(`DELETE FROM validators_cycle_history WHERE date_start>${tx.utime} and (date_start-${tx.utime})/(60*60)<15`)
                                date = tx.utime
                            }
                            else{
                                if (tx.in_msg.value/(10**9)<100000){
                                    in_[0].val+= tx.in_msg.value/(10**9)
                                }
                                else{
                                    in_.push({date:tx.utime,val:tx.in_msg.value/(10**9)})
                                    if (in_.length>1){
                                        let dv = in_.shift()  
                                            if (dv.val<10000){
                                                db_connection.execute(`INSERT INTO validators_history (adnlAddr,walletAddr,date,increase) VALUES('${validator.adnlAddr}','${validator.walletAddr}',${dv.date},${dv.val}) ON DUPLICATE KEY UPDATE increase=${dv.val};`)         
                                            } 
                                        }
                                    db_connection.execute(`INSERT IGNORE INTO validators_cycle_history (date_start,date_end) VALUES (${tx.utime},${tx.utime+(60*60*18)})`)
                                    db_connection.execute(`DELETE FROM validators_cycle_history WHERE date_start>${tx.utime} and (date_start-${tx.utime})/(60*60)<15`)
                                    date = tx.utime
                                }
                            }
                        }
                        else if (tx.out_msgs&&tx.out_msgs[0]&&tx.out_msgs[0].destination == elector_contract){
                            last_action='OUT'
                            if (in_.length>1){
                                if ((in_[0].val-tx.out_msgs[0].value/(10**9))<-100){
                                    let dv = in_.shift()   
                                    if (dv.val<10000){
                                        db_connection.execute(`INSERT INTO validators_history (adnlAddr,walletAddr,date,increase) VALUES('${validator.adnlAddr}','${validator.walletAddr}',${dv.date},${dv.val}) ON DUPLICATE KEY UPDATE increase=${dv.val};`)         
                                    }
                                    in_=[]
                                }
                                else{
                                    in_[0].val-= tx.out_msgs[0].value/(10**9)
                                } 
                            }               
                        }
                    }      
                }
            }
            while (len>1)  
        }
    })
}
analyze_validator()