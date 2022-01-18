import db_connection from '../../db/dbaccess/db_connection'

async function get_complaints() {
    let [rows] = await db_connection.connection.execute('SELECT * from status_complains')
    return {complains:rows}
}
    
export {get_complaints}