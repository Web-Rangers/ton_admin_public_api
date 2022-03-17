import db_connection from '../../db/dbaccess/async_connection'

async function archive_server(){
    await db_connection.connection.execute(`SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`)
    let timestamp = new Date()
    timestamp.setDate(timestamp.getDay()-2)
    timestamp = Math.round(timestamp.getTime()/1000)
    db_connection.connection.execute(`insert ignore into server_ping (server_ip,server_port,time,latency,status_code,archival) select server_ip,server_port,ROUND(UNIX_TIMESTAMP(DATE_FORMAT(FROM_UNIXTIME(time), '%Y-%m-%d 03:00:00'))) AS date_,avg(latency),status_code,1 as archival from server_ping where time<=${timestamp} and archival = 0 group by server_ip,server_port,date_;`).catch((err)=>{if(err)console.log(err);})
    await db_connection.connection.execute(`delete from server_ping where time<=${timestamp} and archival=0;`)
}

export default archive_server