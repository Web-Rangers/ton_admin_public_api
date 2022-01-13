import db_connection from '../../dbaccess/db_connection'

async function update_server(ip, port, time){
    let timestamp = Math.round(new Date().getTime()/1000)
    db_connection.connection.execute(`INSERT INTO status_liteservers (server_ip,server_port,time,latency,status_code) values ('${ip}',${port},${timestamp},${time},${time?true:false}) ON DUPLICATE KEY UPDATE time=${timestamp},latency=${time},status_code=${time?true:false}`) 
    db_connection.connection.execute(`INSERT INTO server_ping (server_ip,server_port,time,latency,status_code) values ('${ip}',${port},${timestamp},${time},${time?true:false})`)
}

export {update_server}