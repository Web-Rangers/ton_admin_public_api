import db_connection from '../../db/dbaccess/db_connection'

async function get_eth_status() {
    let [rows] = await db_connection.connection.query('SELECT eth_bridge from status limit 1')
    return rows[0].eth_bridge
}

export {get_eth_status}