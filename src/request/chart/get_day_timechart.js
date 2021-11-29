
import {Server} from'../../db/models'

async function get_day_timechart(ip,port) {
    let current_date = new Date()
    let [cur_year,cur_month,cur_day,cur_hour]=[current_date.getUTCFullYear(),current_date.getMonth(),current_date.getDate(),current_date.getHours()]

    let server = await Server.findOne({'ip':ip,'port':port})  
    let data = server.years.find(x=>x.year==cur_year).months
                            .find(x=>x.month==cur_month).days
                            .find(x=>x.day==cur_day).data
                            .filter(x=>new Date(x.timestamp).getHours()<=cur_hour)
    
    let result = calc_days(data,cur_day)
    
    if (cur_hour-24<0){
        if (cur_day==1&&cur_month==0){
            let year = server.years.find(x=>x.year==cur_year-1)
            if (year){
                data = year.months.find(x=>x.month==cur_month).days
                            .slice(-1)[0].data
                            .filter(x=>new Date(x.timestamp).getHours()>=24-cur_hour)
                result = Object.assign(calc_days(data,cur_day-1),result)
            }
        }
        else if(cur_day==1){
            data = server.years.find(x=>x.year==cur_year).months
                            .find(x=>x.month==cur_month-1).days
                            .slice(-1)[0].data
                            .filter(x=>new Date(x.timestamp).getHours()>=24-cur_hour)
            result = Object.assign(calc_days(data,cur_day-1),result)
        }
        else{
            let day = server.years.find(x=>x.year==cur_year).months
                            .find(x=>x.month==cur_month).days
                            .find(x=>x.day==cur_day-1)
                           
            if(day){
                data = day.data
                .filter(x=>new Date(x.timestamp).getHours()>=24-cur_hour)
                result = Object.assign(calc_days(data,cur_day-1),result)
            }     
        }
    } 
    
    return result
}
function calc_days(data,day) {
    let result = {}
    for (let dat of data) {
        let index = `${day}-${new Date(dat.timestamp).getHours()}`
        if (!result[index]){
            result[index]=[]
        }    
        
        if (dat.args){
            let length = result[index].length-1
            if(result[index][length]&&result[index][length]!=0){
                result[index][length] = (result[index][length]+dat.avg)/2
            }
            else{
                result[index].push(dat.avg)   
            }
        }
        else{
            result[index].push(0)  
        }
            
    } 
    
    return result
}
    
export default get_day_timechart