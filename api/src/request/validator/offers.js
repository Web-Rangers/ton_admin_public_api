import db_connection from '../../db/dbaccess/db_connection'

async function get_offers() {
    let [rows] = await db_connection.connection.query('SELECT * from status_offers')
    return {'offers': rows}
}
    
export {get_offers}