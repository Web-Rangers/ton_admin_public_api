import db_connection from '../../db/dbaccess/db_connection'

async function get_bsc_status() {
    let [rows] = await db_connection.connection.execute('SELECT bsc_bridge from status limit 1')
    return rows[0].bsc_bridge
}

export {get_bsc_status}