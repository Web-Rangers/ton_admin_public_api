import db_connection from '../../db/dbaccess/db_connection'

function archive_server(){
    let timestamp = new Date()
    timestamp.setDate(timestamp.getDay()-2)
    timestamp = Math.round(timestamp.getTime()/1000)
    db_connection.connection.execute(`insert into server_ping (server_ip,server_port,time,latency,status_code,archival) select server_ip,server_port,ROUND(UNIX_TIMESTAMP(DATE_FORMAT(FROM_UNIXTIME(time), '%Y-%m-%d 03:00:00'))) AS date_,avg(latency),status_code,1 as archival from server_ping where time<=${timestamp} and archival = 0 group by server_ip,server_port,date_;`)
    db_connection.connection.execute(`delete from server_ping where time<=${timestamp} and archival=0;`)
}

export default archive_server