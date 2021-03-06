import db_connection from '../../../db/dbaccess/db_connection'
import get_time from '../../../helpers/time_wizard'

async function get_page_chart(service_name,page_name,time_period,time_value) {
    let time = get_time(time_period,time_value)
    let now = Math.round(new Date().getTime()/1000)-time[0]*time[1]
    let [rows] = await db_connection.connection.query(`SELECT ROUND((UNIX_TIMESTAMP() - time)/(${time[0]})) as date,avg(latency)as value from service_ping WHERE service_name='${service_name}' and page_name = '${page_name}' and time >= ${now} and status_code=200 group by date;`)
    return rows
}

export {get_page_chart}