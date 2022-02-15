const {known_accounts}= require('../../data/known_accounts')
const mysql  = require('mysql2')
const axios = require('axios')
const args = require('minimist')(process.argv.slice(2))
const dotenv = require('dotenv')
const TonWeb = require('tonweb')
const ton_web = new TonWeb(new TonWeb.HttpProvider('https://wallet.toncenter.com/api/v2/jsonRPC'))
dotenv.config();
const db_connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    port : process.env.DB_PORT,
    database: process.env.DB_NAME,
    password : process.env.DB_PASSWRD,
})
async function fetch(){
    console.log(args);
    let blockTransactions = await ton_web.provider.getBlockTransactions(args.chain, String(args.shard), args.seqno); // todo: (tolya-yanot) `incomplete` is not handled in response
    
    console.log(blockTransactions.transactions);

    for (const shortTx of accounts) {
        transactions = []
        let bounceble = new TonWeb.Address(shortTx).toString(true,true,true,false)
        let timestamp = Math.round(new Date().getTime()/1000)
        let headers = {
            'Accept':'*/*',
            'Accept-Encoding':'gzip, deflate, br',
            'Connection':'keep-alive',
            'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'
        }
        let txs = await axios.get(`https://api.ton.cat/v2/explorer/getTransactions?address=${bounceble}&limit=4&lo_lt=0&archival=false`,{headers:headers})
        const tx = txs.data.result[0];
        //need to fix
        if (tx&&tx.in_msg) {
            console.log(tx);
            let type = ''
            let direction = ''
            if (tx.in_msg.value!=0){
                if (known_accounts[bounceble]){
                    type = known_accounts[bounceble]
                }
                else if(known_accounts[tx.in_msg.source]) {
                    type = known_accounts[tx.in_msg.source]
                }
                else if(known_accounts[tx.in_msg.destination]){
                    type = known_accounts[tx.in_msg.destination]
                }
                else{
                    type = 'between_accounts'
                }
                if (type == 'between_accounts'){
                    db_connection.connection.execute(`INSERT INTO status_account_activity (account,time) values ('${bounceble}',${timestamp}) ON DUPLICATE KEY UPDATE time=${timestamp}`)
                    db_connection.connection.execute(`DELETE FROM status_account_activity WHERE time<${timestamp-60*60*24}`)
                }
                if (type){
                    console.log(tx);
                    if (tx.in_msg.source == bounceble)
                    {
                        direction = 'out'
                        // mean - money out
                    }
                    else{
                        direction = 'in'
                        //mean - moneu in  
                    }
                    
                    transactions.push({
                        hash:shortTx.hash,
                        from: tx.in_msg.source,
                        to: tx.in_msg.destination,
                        type:type,
                        value:tx.in_msg.value,
                        direction:direction,
                        message:tx.in_msg.message
                    })
                }
            }  
        }
    }
    for (let transaction of transactions) {
        if (insert_str==''){
            insert_str+=`('${transaction.from}','${transaction.hash}','${transaction.to}','${transaction.type}','${transaction.direction}',${mcBlockNumber},${transaction.value},${time})`
            continue
        }
        insert_str+=`,('${transaction.from}','${transaction.hash}','${transaction.to}','${transaction.type}','${transaction.direction}',${mcBlockNumber},${transaction.value},${time})`    
    }
    
    try{
        if (insert_str.length>0){
            db_connection.connection.execute(`INSERT INTO status_transactions (from_ ,hash ,to_ ,type ,direction ,block_height,value ,time) VALUES ${insert_str}`,(err,res)=>{if(err)console.log(err);})
        }
    }
    catch (e){
        console.log(insert_str);
    }
}
fetch()
