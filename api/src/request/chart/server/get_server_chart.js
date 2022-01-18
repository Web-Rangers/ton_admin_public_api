import db_connection from '../../../db/dbaccess/db_connection'
import get_time from '../../../helpers/time_wizard'

async function get_server_chart(server_ip,server_port,time_period,time_value) {
    let time = get_time(time_period,time_value)
    let time_above = Math.round(new Date().getTime()/1000)-time[0]*time[1]
    let [rows] = await db_connection.connection.execute(`SELECT ROUND((UNIX_TIMESTAMP() - time)/(${time[0]})) as date,avg(latency)as value from server_ping WHERE server_ip='${server_ip}' and server_port = ${server_port} and time >= ${time_above} group by date;`)
    return rows
}

export {get_server_chart}