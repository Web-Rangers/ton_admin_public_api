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
    let transactions = await axios.get(`https://wallet.toncenter.com/api/v2/getTransactions?address=${validatorAddress}&limit=150&archival=false`,{headers:headers})
    txs = transactions.data.result
    if(txs.length > 0){
        txs = txs.filter(tx=>(tx.out_msgs && tx.out_msgs[0] && tx.out_msgs[0].destination == elector_contract && tx.out_msgs[0].value/10**9 > 15) || (tx && tx.in_msg.source == elector_contract && tx.in_msg.value/10**9 > 15))
        if (txs.length==0){
            continue
        } 
       
        for (tx of txs){
            if (tx.in_msg.source == elector_contract){
                console.log(tx.utime,tx.in_msg.value/(10**9));
                if (last_action != 'IN'){
                    last_action='IN'
                    if (in_.length>1){
                        let dv = in_.shift()  
                        if (dv.val<10000){ 
                            try {
                                db_connection.execute(`INSERT INTO validators_history (adnlAddr,walletAddr,date,increase) VALUES('${validator.adnlAddr}','${validator.walletAddr}',${dv.date},${dv.val})`)      
                            } catch (error) {
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
}
export default analyze_validator