import TonWeb from "tonweb";


const analyze_validator = async (validatorAddress,strt_validation,end_validation) => {
    let tonweb = new TonWeb(new TonWeb.HttpProvider('https://tonchain.co/api/v2/jsonRPC'))
    let txs = [];
    let transactions = await tonweb.getTransactions(validatorAddress, 100, undefined, undefined,undefined)

    txs = txs.concat(transactions)  
    // console.log(txs);
    if(txs.length > 0){
      txs = txs.filter(tx=>tx.utime>=strt_validation && tx.utime <=end_validation)
              .filter(tx=>(tx.out_msgs && tx.out_msgs[0] && tx.out_msgs[0].destination == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF" && tx.out_msgs[0].value/10**9 > 15) || (tx && tx.in_msg.source == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF" && tx.in_msg.value/10**9 > 15))
      console.log(txs);
      let profit = 0;
      let i = 0;
      for(let txrow in txs){
        let tx = txs[txrow];
        //Skip the last placed stake that did not return from elector
        if(tx.in_msg.source == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"){
          profit -= tx.in_msg.value/10**9;
        }
        if(tx.out_msgs[0].destination == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"){
          profit += tx.out_msgs[0].value/10**9
        }
      }
      console.log(profit);
  }
}
export default analyze_validator