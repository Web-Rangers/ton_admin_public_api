const axios = require('axios')
const mysql  = require('mysql2')
const dotenv = require('dotenv')
dotenv.config();

const db_connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    port : process.env.DB_PORT,
    database: process.env.DB_NAME,
    password : process.env.DB_PASSWRD,
})


const analyze_validator = async () => {
    // let tonweb = new TonWeb(new TonWeb.HttpProvider('https://wallet.toncenter.com/api/v2/'))
    db_connection.execute('SELECT * FROM status_validators',async(err,res)=>{
        let txs = [];
        axios.default.defaults.headers['Accept']='*/*'
        axios.default.defaults.headers['Accept-Encoding']='gzip, deflate, br'
        axios.default.defaults.headers['Connection']='keep-alive'
        axios.default.defaults.headers['User-Agent']= 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'
        for (let validator of res) {
            
            let transactions = await axios.get(`https://wallet.toncenter.com/api/v2/getTransactions?address=${validator.walletAddr}&limit=100000&lo_lt=0&archival=false`)
            txs = txs.concat(transactions.data.result)  
            // console.log(txs);
            let last_date = undefined
            if(txs.length > 0){
                console.log(validator.walletAddr);
                txs = txs.filter(tx=>(tx.out_msgs && tx.out_msgs[0] && tx.out_msgs[0].destination == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF" && tx.out_msgs[0].value/10**9 > 15) || (tx && tx.in_msg.source == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF" && tx.in_msg.value/10**9 > 15))
                // console.log(txs);
                let date = undefined
                let in_ = []
                let last_action = undefined
                for (tx of txs){
                    if (tx.in_msg.source == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"){
                        if (last_action != 'IN'){
                            last_action='IN'
                            in_.push({date:tx.utime,val:tx.in_msg.value/(10**9)})
                            db_connection.execute(`INSERT IGNORE INTO validators_cycle_history (date_start,date_end) VALUES (${tx.utime},${tx.utime+(60*60*18)})`)
                            db_connection.execute(`DELETE FROM validators_cycle_history WHERE date_start>${tx.utime} and (date_start-${tx.utime})/(60*60)<15`)
                            date = tx.utime
                        }
                    }
                    else if (tx.out_msgs&&tx.out_msgs[0]&&tx.out_msgs[0].destination == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"){
                        if (in_.length==0)continue
                        last_action='OUT'
                        if (date&&tx.utime<date){
                            if (in_.length==2){
                                let dv = in_.shift()
                                if (Math.floor((dv.date-tx.utime)/(60*60))==36){
                                    let profit = dv.val - tx.out_msgs[0].value/(10**9)
                                    db_connection.execute(`INSERT IGNORE INTO validators_history (adnlAddr,walletAddr,date,increase) VALUES('${validator.adnlAddr}','${validator.walletAddr}',${dv.date},${profit})`)   
                                }
                               
                            }
                        }
                    }
                }
            } 
        }
    })
    
}
analyze_validator()