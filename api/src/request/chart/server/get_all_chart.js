import db_connection from '../../../db/dbaccess/db_connection'
import get_time from '../../../helpers/time_wizard'

async function get_servers_chart(time_period,time_value) {
    let time = get_time(time_period,time_value)
    let time_above = Math.round(new Date().getTime()/1000)-time[0]*time[1]
    let [rows] = await db_connection.connection.query(`SELECT ROUND((UNIX_TIMESTAMP() - time)/(${time[0]})) as date,avg(latency)as value from server_ping WHERE time >= ${time_above} group by date;`)
    return rows
}

export {get_servers_chart}