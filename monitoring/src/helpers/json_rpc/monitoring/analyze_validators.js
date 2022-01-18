const buildChart = async (txs) => {
    let validatorAddress = props.validatorAddress;
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
        setLoading(false)
        }
    } while (txs[0].utime < (Math.floor(Date.now() / 1000) - 2628000) )
    if(txs.length > 0){
      let txDataArray = []
        if((tx.out_msgs && tx.out_msgs[0] && tx.out_msgs[0].destination == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF" && tx.out_msgs[0].value/10**9 > 15) || (tx && tx.in_msg.source == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF" && tx.in_msg.value/10**9 > 15) ){
          txDataArray.push(tx)
        }
    }
    let chartData = []
    let apexBarChartOpts = chartOpts
    if(txs){
      let tableData = []
      txs = txs
      let income = 0;
      let i = 0;
      let weeklyIncome = 0, lastWeekIncome = 0, weeklyArray = [];
      for(let txrow in txs){
        let tx = txs[txrow];

        // Skip the last placed stake that did not return from elector
        if(tx && tx.in_msg.source == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF" && tx.in_msg.value/10**9 > 10000 ){
          i++
          income = tx.in_msg.value/10**9;
        }

        if(tx.out_msgs && tx.out_msgs[0] && tx.out_msgs[0].destination == "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF" && tx.out_msgs[0].value/10**9 > 10000 && i != 0){

          let profit = income - tx.out_msgs[0].value/10**9

          if(profit < 0){
            continue;
          }
          let annotation;
          if(profit >= tx.out_msgs[0].value/10**9){
            profit = profit - tx.out_msgs[0].value/10**9
            annotation = 'Returned 2 stakes'
          }
          if(profit < 10000){
            if(tx.utime > (Math.floor(Date.now() / 1000) - 604800) ){
              weeklyArray.push(parseInt(profit))
              weeklyIncome += profit
            }
            if(tx.utime > (Math.floor(Date.now() / 1000) - (604800*2)) && tx.utime < (Math.floor(Date.now() / 1000) - 604800)){
              lastWeekIncome += profit
            }
            chartData.push({'x': new Date(tx.utime * 1000), 'y' : profit.toFixed(0)})
            if(annotation){
              
            }
          }
          if(profit < 300000){
              income = 0;
          }
        }


      }
      localStorage.setItem('WeeklyIncome', JSON.stringify([weeklyArray, parseInt(weeklyIncome), parseInt(lastWeekIncome)]))
      let apexBarChartData = [
          {
              name: 'Earnings',
              data: chartData.reverse(),
          },
      ];


  }else{
    
  }
}