import axios from "axios";
import db_connection from '../../../db/dbaccess/db_connection'

const analyze_validator = async (validatorAddress) => {
    let txs = [];
    let headers = {
      'Accept':'*/*',
      'Accept-Encoding':'gzip, deflate, br',
      'Connection':'keep-alive',
      'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'
    }
    let transactions = await axios.get(`https://wallet.toncenter.com/api/v2/getTransactions?address=${validatorAddress}&limit=150&lo_lt=0&archival=false`,{headers:headers})
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
                            db_connection.connection.execute(`INSERT IGNORE INTO validators_history (adnlAddr,walletAddr,date,increase) VALUES('${validator.adnlAddr}','${validator.walletAddr}',${dv.date},${profit})`)   
                        }
                        
                    }
                }
            }
        }
    } 
}
export default analyze_validator