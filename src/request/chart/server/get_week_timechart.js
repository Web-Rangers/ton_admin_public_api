
import {Server} from'../../../db/models'

async function get_week_timechart(ip,port) {
    let current_date = new Date()
    let [cur_year,cur_month,cur_day]=[current_date.getUTCFullYear(),current_date.getMonth(),current_date.getDate()]
    //NADA DADELAT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    let server = await Server.findOne({'ip':ip,'port':port})  
    let result = {}
    if (cur_day-7<0){
        let year = server.years.find(x=>x.year==cur_year)
        let this_months = year.months.filter(x=>x.month==(cur_month-1))
        let days = this_months.days.filter(x=>x.day>=7-7-cur_day)
        result = Object.assign(calc_days(days,year,cur_month),result)
        if (cur_month==0){
            year = server.years.find(x=>x.year==cur_year-1)
            this_months = year.months.filter(x=>x.month==(cur_month-1))
            
        }
        else{
            year = server.years.find(x=>x.year==cur_year)
            this_months = year.months.filter(x=>x.month==(cur_month-1)) 
        }
        days = this_months.days.filter(x=>x.day>=(cur_day-7))
        result = Object.assign(calc_days(days,year,cur_month),result)
    }  
    else{ 
        let year = server.years.find(x=>x.year==cur_year)
        let this_months = year.months.find(x=>x.month==cur_month)
    
        let days = this_months.days.filter(x=>(x.day<=cur_day)&&(x.day>=(cur_day-7)))
        result = calc_days(days,year,cur_month)  
    }
    
    
    return result
}
function calc_days(days,year,month) {
    let result = {}
    
    for (let day of days) {
        let index = `${year.year}-${month}-${day.day}`
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
    
    return result
}
    
export default get_week_timechart