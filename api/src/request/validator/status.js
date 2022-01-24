import db_connection from '../../db/dbaccess/db_connection'

async function get_validators() {
    // let status = await Status.findOne({})
    let [rows] = await db_connection.connection.query('SELECT * from status LIMIT 1')
    return {'total':rows[0].totalValidators,'active':rows[0].onlineValidators}
}

export {get_validators}