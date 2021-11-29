
import {Server} from'../../db/models'

async function get_year_timechart(ip,port) {
    let current_date = new Date()
    let [cur_year,cur_month]=[current_date.getUTCFullYear(),current_date.getMonth()]

    let server = await Server.findOne({'ip':ip,'port':port})  
    let year = server.years.find(x=>x.year==cur_year)
    let year_months = year.months.filter(x=>x.month<=cur_month)

    let result = calc_month(year_months,year)
    
    if (cur_month-12<0){
        let prev_year = server.years.find(x=>x.year==cur_year-1)
        if(prev_year){
            let prev_year_months = prev_year.months.filter(x=>x.month>=12-(-1*(cur_month-12)))
            result = [calc_month(prev_year_months,prev_year),...result]
        }
    }
    
    return result
}
function calc_month(months,year) {
    let result = {}
    for (let month of months) {
        for (let day of month.days) {
            let index = `${year.year}-${month.month}`
            if (!result[index]){
                result[index]=[]
            }    
            for (let i = 0; i < day.data.length-1; i++) {
                if (day.data[i].args){
                    let length = result[index].length-1
                    if(result[index][length]&&result[index][length]!=0){
                        result[index][length] = (result[index][length]+day.data[i].avg)/2
                    }
                    else{
                        result[index].push(day.data[i].avg)   
                    }
                }
                else{
                    result[index].push(0)  
                }
            }     
        } 
    }
    return result
}
    
export default get_year_timechart