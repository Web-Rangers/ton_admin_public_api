import db_connection from '../../db/dbaccess/db_connection'


async function get_elections_data() {
    let [rows] = await db_connection.connection.query('SELECT * from status LIMIT 1')
    return {'id': rows[0].electionId,'start':rows[0].startElection,
            'end': rows[0].endElection, 'next': rows[0].startNextElection}
}

export {get_elections_data}