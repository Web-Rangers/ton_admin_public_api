import db_connection from '../../../db/dbaccess/db_connection'
import get_time from '../../../helpers/time_wizard'

async function get_service_chart(service_name,time_period,time_value) {
    let time = get_time(time_period,time_value)
    let now = Math.round(new Date().getTime()/1000)-time[0]*time[1]
    let [rows] = await db_connection.connection.execute(`SELECT ROUND((UNIX_TIMESTAMP() - time)/(${time[0]})) as date,avg(latency)as value from service_ping WHERE service_name='${service_name}' and time >= ${now} group by date;`)
    return rows
}

export {get_service_chart}