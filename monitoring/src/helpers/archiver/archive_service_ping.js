import db_connection from '../../db/dbaccess/db_connection'

function archive_service(){
    let timestamp = new Date()
    timestamp.setDate(timestamp.getDay()-2)
    timestamp = Math.round(timestamp.getTime()/1000)
    db_connection.connection.execute(`insert into service_ping (service_name,page_name,time,latency,status_code,archival) select service_name,page_name,ROUND(UNIX_TIMESTAMP(DATE_FORMAT(FROM_UNIXTIME(time), '%Y-%m-%d 03:00:00'))) AS date_,avg(latency),status_code,1 as archival from service_ping where time<=${timestamp} and archival = 0 group by service_name,page_name,date_;`)
    db_connection.connection.execute(`delete from service_ping where time<=${timestamp} and archival=0;`)
}

export default archive_service