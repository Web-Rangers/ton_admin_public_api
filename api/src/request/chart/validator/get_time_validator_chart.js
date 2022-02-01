import db_connection from '../../../db/dbaccess/db_connection'
import get_time from '../../../helpers/time_wizard'

async function get_validator_period_chart(wallet,time_period,time_value) {
    let time = get_time(time_period,time_value)
    let now = Math.round(new Date().getTime()/1000)-time[0]*time[1]
    let [rows] = await db_connection.connection.query(`SELECT date, increase as value FROM ton_status.validators_history where walletAddr='${wallet}' and date >=${now} order by date;`)
    return rows
}

export {get_validator_period_chart}