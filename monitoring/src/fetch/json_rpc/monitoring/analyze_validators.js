const axios = require('axios')
const mysql  = require('mysql2/promise')
const dotenv = require('dotenv')
dotenv.config();
const db_connection = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    port : process.env.DB_PORT,
    database: process.env.DB_NAME,
    password : process.env.DB_PASSWRD
})

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const elector_contract = "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"
let last_in = undefined
const analyze_validator = async () => {
    let txs = [];
    // axios.default.defaults.headers['Accept']='application/json'
    // axios.default.defaults.headers['Accept-Encoding']='gzip, deflate, br'
    // axios.default.defaults.headers['Connection']='keep-alive'
    // axios.default.defaults.headers['User-Agent']= 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 OPR/83.0.4254.70'
    axios.default.defaults.headers['X-API-Key'] = 'd0996ed62fd36cfed14e2fb2341a39aa3e6b3f5a837e86c76b38e7401bd48385'
    
    db_connection.execute('SELECT * FROM status_validators').then(async(res)=>{
        for (let validator of res[0]) {
            await delay(100)
            try {
                let transactions = await axios.get(`https://toncenter.com/api/v2/getTransactions?address=${validator.walletAddr}&to_lt=0&limit=70&archival=true`,{timeout: 3000})
                txs = transactions.data.result
                txs = txs.filter(tx=>(tx.out_msgs && tx.out_msgs[0] && tx.out_msgs[0].destination == elector_contract && tx.out_msgs[0].value/10**9 > 1000) || (tx && tx.in_msg.source == elector_contract && tx.in_msg.value/10**9 > 1000))
                let in_ = []
                let elector_pre_stake = []
                let last_action = undefined
                last_in = undefined
                if(txs.length > 0){
                    console.log(validator.walletAddr);
                    
                    for (let i = 0; i < txs.length; i++) {
                        let tx = txs[i];
                        if (tx.in_msg.source == elector_contract){
                            // console.log(tx.in_msg.value/(10**9), tx.utime);
                            if (last_action != 'IN'){
                                last_action='IN'
                                await insert(in_,validator)
                                in_.push({date:tx.utime,val:tx.in_msg.value/(10**9)})
                            }
                            else{
                                if((in_[in_.length-1].val/(tx.in_msg.value/(10**9))>9)){
                                    elector_pre_stake.push(tx.in_msg.value/(10**9))
                                }
                                else{
                                    in_.push({date:tx.utime,val:tx.in_msg.value/(10**9)})  
                                }
                            }
                        }
                        else if (tx.out_msgs&&tx.out_msgs[0]&&tx.out_msgs[0].destination == elector_contract){
                            last_action='OUT'
                            if (in_[1]) { 
                                if (in_[0].val-tx.out_msgs[0].value/(10**9)<-1000){
                                    if(elector_pre_stake.length>0){
                                        if((in_[0].val+elector_pre_stake[0]-tx.out_msgs[0].value/(10**9))>-1000){
                                            in_[0].val-= tx.out_msgs[0].value/(10**9)
                                            in_[0].val+=elector_pre_stake.pop()
                                            await insert(in_,validator)
                                        }
                                        else{
                                            in_[1].val-= tx.out_msgs[0].value/(10**9)
                                            in_[1].val+=elector_pre_stake.pop()
                                            await insert(in_,validator) 
                                        } 
                                        continue
                                    }
                                    in_[1].val-= tx.out_msgs[0].value/(10**9)
                                    await insert(in_,validator)     
                                    continue
                                }
                                in_[0].val-= tx.out_msgs[0].value/(10**9)
                            }
                            else if(in_[0]){
                                //console.log((in_[0].date-tx.utime)/(60*60));
                                if(((in_[0].date-tx.utime)/(60*60))>=36){
                                    in_[0].val-= tx.out_msgs[0].value/(10**9)
                                    if ((in_[0].val<0)&&(elector_pre_stake.length>0)){
                                        in_[0].val+=elector_pre_stake.pop()
                                    }
                                }
                            }               
                        }
                    }      
                } 
            } catch (error) {
                console.log(error);
            }
        }
    })
}

async function insert(in_,validator){
    if ((in_.length>1)){
        let dv = in_.shift() 
        if (last_in&&(Math.abs(dv.val)/Math.abs(last_in))>9)return
        if (!last_in){last_in=Math.abs(dv.val)}
        try {
            await db_connection.execute(`INSERT INTO validators_history (adnlAddr,walletAddr,date,increase) VALUES('${validator.adnlAddr}','${validator.walletAddr}',${dv.date},${dv.val})`)
        } catch (error) {
            
        }
    }
}
analyze_validator()