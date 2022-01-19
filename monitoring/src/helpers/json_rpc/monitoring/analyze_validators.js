const analyze_validator = async (validatorAddress,strt_validation,end_validation) => {
    // localStorage.removeItem('earnings@' + validatorAddress)
    let lt = null, txhash = null;
    txs = [];
    do {
        txs = txs.concat(await tonweb.getTransactions(validatorAddress, 400, lt, txhash))
        if(txs.length > 0){
        lt = Number(txs[txs.length-1].transaction_id.lt)
        txhash = tonweb.utils.bytesToHex(tonweb.utils.base64ToBytes(txs[txs.length-1].transaction_id.hash))
        }else{
          break;
        }
    } while (txs[0].utime < (Math.floor(Date.now() / 1000) - 2628000) )
    if(txs.length > 0){
      txs = txs.filter(tx=>tx.utime>=strt_validation && tx.utime <=end_validation)
              .filter((tx.out_msgs && tx.out_msgs[0] && tx.out_msgs[0].destination == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF" && tx.out_msgs[0].value/10**9 > 15) || (tx && tx.in_msg.source == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF" && tx.in_msg.value/10**9 > 15))
      txs = txs
      let profit = 0;
      let i = 0;
      for(let txrow in txs){
        let tx = txs[txrow];
        //Skip the last placed stake that did not return from elector
        if(tx && tx.in_msg.source == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF" && tx.in_msg.value/10**9 > 10000 ){
          profit -= tx.in_msg.value/10**9;
        }
        if(tx.out_msgs && tx.out_msgs[0] && tx.out_msgs[0].destination == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF" && tx.out_msgs[0].value/10**9 > 10000){
          profit += tx.out_msgs[0].value/10**9
        }
      }
  }
}
export default analyze_validator