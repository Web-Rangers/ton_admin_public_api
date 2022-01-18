import db_connection from '../../db/dbaccess/db_connection'

async function get_tps() {
    let [rows] = await db_connection.connection.execute('SELECT tpsAvg from status limit 1')
    return rows[0].tpsAvg
}

export {get_tps}