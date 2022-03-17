import axios from 'axios'
let pool_wallet = 'EQDfbIxBNnGdCSYyKu0SxPtdzVrUBWlc73LXHia4fLt2Ia8i'
let pool_name = 'tonuniverse'
import db_connection from '../../../db/dbaccess/async_connection'

async function get_tonuniverse_rate(){
    let response = await axios.post('https://pool.tonuniverse.com/api', {headers:{'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}})
    response = response.data.response
    await db_connection.connection.execute(`INSERT INTO status_pool (address,name,hashrate,miners,dmined,ppGH) values ('${pool_wallet}','${pool_name}',${Number(response.hashrate)},${response.miners},${response.mined},${Number(response.hm)})`)
}

export default get_tonuniverse_rate