import db_connection from '../../db/dbaccess/db_connection'


async function get_accounts_data() {
    let [rows] = await db_connection.connection.query('SELECT count(*)as c_accounts from status_account_activity')
    return rows[0].c_accounts
}
    
export {get_accounts_data}