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
                validator.walletAddr='Ef-4wGDdtaSFk7gWezRrHRTbBGW6X5FLVDBkHkzxZjZLXUtQ'
                let transactions = await axios.get(`https://api.ton.cat/v2/explorer/getTransactions?address=${validator.walletAddr}&limit=130&archival=false`,{timeout: 3000})
                txs = transactions.data.result
                let in_ = []
                let last_action = undefined
                if(txs.length > 0){
                
                    let in_transactions= txs.filter(tx=>(tx && tx.in_msg.source == elector_contract && tx.in_msg.value/10**9 > 15))
                    let out_transactions= txs.filter(tx=>(tx.out_msgs && tx.out_msgs[0] && tx.out_msgs[0].destination == elector_contract && tx.out_msgs[0].value/10**9 > 15))
                    console.log(validator.walletAddr);
                    
                    for (const tx of in_transactions) {
                        tx.in_msg.value =  tx.in_msg.value/10**9
                        let txs_out = out_transactions.filter(t=>(Math.abs(tx.utime-t.utime)/(60*60)>35)&&(Math.abs(tx.utime-t.utime)/(60*60)<37)).map(x=>x={'utime':Math.abs(tx.utime-x.utime)/(60*60),'value':x.out_msgs[0].value/10**9})
                        console.log(tx.utime,tx.in_msg.value);
                        
                        console.log(txs_out);
                        for (let i = txs_out.length-1; i >= 0; i--) {
                            let txo = txs_out[i];
                            if (tx.in_msg.value>0){
                                tx.in_msg.value-=txo.value
                            }
                        }
                        console.log(tx.in_msg.value);
                        
                    }
                    // for (let i = 0; i < txs.length; i++) {
                    //     let tx = txs[i];
                    //     if (tx.in_msg.source == elector_contract){
                    //         console.log(tx.in_msg.value/(10**9), tx.utime);
                    //         if (last_action != 'IN'){
                    //             last_action='IN'
                    //             if ((in_.length>1)){
                    //                 let dv = in_.shift() 
                                     
                    //                 try {
                    //                     db_connection.execute(`INSERT INTO validators_history (adnlAddr,walletAddr,date,increase) VALUES('${validator.adnlAddr}','${validator.walletAddr}',${dv.date},${dv.val}) ON DUPLICATE KEY UPDATE increase=${dv.val}`)      
                    //                 } catch (error) {
                    //                     console.log('continueeeeeeeee');
                    //                     break
                    //                 }  
                    //             }
                    //             in_.push({date:tx.utime,val:tx.in_msg.value/(10**9)})
                    //         }
                    //         else{
                    //             in_[in_.length-1].val+= tx.in_msg.value/(10**9)
                    //             console.log('aaaaa',in_[in_.length-1]);
                    //         }
                    //     }
                    //     else if (tx.out_msgs&&tx.out_msgs[0]&&tx.out_msgs[0].destination == elector_contract){
                    //         last_action='OUT'
                    //         console.log(tx.out_msgs[0].value/(10**9));
                    //         if (in_[0]) {
                    //             console.log((in_[0].date-tx.utime)/(60*60));
                    //             if (((in_[0].date-tx.utime)/(60*60)>=35)&&((in_[0].date-tx.utime)/(60*60)<42)){ 
                    //                 in_[0].val-= tx.out_msgs[0].value/(10**9)
                    //             } 
                    //             else{
                    //                 let dv = in_.shift() 
                                    
                    //                 if (dv.val<10000){ 
                    //                     try {
                    //                         db_connection.execute(`INSERT INTO validators_history (adnlAddr,walletAddr,date,increase) VALUES('${validator.adnlAddr}','${validator.walletAddr}',${dv.date},${dv.val}) ON DUPLICATE KEY UPDATE increase=${dv.val}`)      
                    //                     } catch (error) {
                    //                         console.log('continueeeeeeeee');
                    //                         break
                    //                     }
                    //                 }
                    //             }
                    //         }                
                    //     }
                    // }      
                } 
            } catch (error) {
                console.log(error);
                continue
            }
        }
    })
}
analyze_validator()