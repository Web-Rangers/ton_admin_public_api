import axios from "axios";
import TonWeb from "tonweb";


const analyze_validator = async (validatorAddress,strt_validation,end_validation) => {
    // let tonweb = new TonWeb(new TonWeb.HttpProvider('https://wallet.toncenter.com/api/v2/'))
    let txs = [];
    console.log(strt_validation,end_validation);
    let transactions = await axios.get(`https://wallet.toncenter.com/api/v2/getTransactions?address=${validatorAddress}&limit=200&lo_lt=0&archival=true`)
    txs = txs.concat(transactions.data.result)  
    // console.log(txs);
    if(txs.length > 0){
      // txs = txs.filter(x=>x.utime>=strt_validation && x.utime<=end_validation)
      let profit = 0;
      // console.log(txs);
      txs = txs.filter(tx=>(tx.out_msgs && tx.out_msgs[0] && tx.out_msgs[0].destination == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF" && tx.out_msgs[0].value/10**9 > 15) || (tx && tx.in_msg.source == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF" && tx.in_msg.value/10**9 > 15))
      // console.log(txs);
      let i = 0;
      for(let txrow in txs){
        let tx = txs[txrow];
        //Skip the last placed stake that did not return from elector
        if(tx.in_msg.source == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"){
          profit -= tx.in_msg.value/10**9;
        }
        else 
        if(tx.out_msgs && tx.out_msgs[0].destination == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"){
          profit += tx.out_msgs[0].value/10**9
        }
      }
      console.log(profit);
  }
}
export default analyze_validator