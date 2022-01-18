import db_connection from '../../db/dbaccess/db_connection'

async function get_liteservers() {
    let [rows] = await db_connection.connection.execute('SELECT * from status_liteservers')
    console.log(rows);
    return rows.map(x=>x={ip:x.server_ip,port:x.server_port,latency:x.latency,'status':x.status_code>0})
}

export {get_liteservers}