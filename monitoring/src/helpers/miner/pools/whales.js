import axios from 'axios'
let pool_wallet = 'EQAAFhjXzKuQ5N0c96nsdZQWATcJm909LYSaCAvWFxVJP80D'
let pool_name = 'Whales'
import db_connection from '../../../db/dbaccess/db_connection'

async function get_whales_rate(){
   
    // db_connection.connection.execute(`INSERT INTO status_pool (address,name,hashrate,miners,dmined,ppGH) values ('${pool_wallet}','${pool_name}',${Number(response.hashrate)},${response.miners},${response.mined},${Number(response.hm)})`)
}

export default get_whales_rate