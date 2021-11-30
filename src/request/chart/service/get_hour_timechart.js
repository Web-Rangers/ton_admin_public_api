
import {Service} from'../../../db/models'

async function get_hour_timechart(service_name,page_name) {
    let current_date = new Date()
    let [cur_year,cur_month,cur_day,cur_hour,cur_minutes]=[current_date.getUTCFullYear(),current_date.getMonth(),current_date.getDate(),current_date.getHours(),current_date.getUTCMinutes()]

    
    let service = await Service.findOne({'name':service_name})  
    
    let page = service.pages.find(x=>x.name==page_name)

    let data = page.years.find(x=>x.year==cur_year).months
                            .find(x=>x.month==cur_month).days
                            .find(x=>x.day==cur_day).data
                            .filter(x=>new Date(x.timestamp).getHours()==cur_hour)
    
    let result = calc_days(data,cur_hour)
    
    if (cur_minutes-60<0){
        if (cur_month==0&&cur_hour==0){
            let year = page.years.find(x=>x.year==cur_year-1)
            if (year){
                data = year.months.find(x=>x.month==cur_month).days
                            .slice(-1)[0].data
                            .filter(x=>new Date(x.timestamp).getUTCMinutes()>=60-(60-cur_minutes))
                result = Object.assign(calc_days(data,cur_hour-1),result)
            }
        }
        else if(cur_hour==0){
            let day = page.years.find(x=>x.year==cur_year).months
            .find(x=>x.month==cur_month).days
            .find(x=>x.day==cur_day-1)
            if (day){
                data = day.data
                .filter(x=>new Date(x.timestamp).getUTCMinutes()>=60-(60-cur_minutes))
                result = Object.assign(calc_days(data,cur_hour-1),result)
            } 
        }
        else{
            data = page.years.find(x=>x.year==cur_year).months
                            .find(x=>x.month==cur_month).days
                            .find(x=>x.day==cur_day).data
                            .filter(x=>(new Date(x.timestamp).getUTCMinutes()>=60-(60-cur_minutes))&&(new Date(x.timestamp).getHours()==cur_hour-1))    
            result = Object.assign(calc_days(data,cur_hour-1),result)
        }
    } 
    
    return result
}
function calc_days(data,hour) {
    let result = {}
    for (let dat of data) {
        let index = `${hour}-${new Date(dat.timestamp).getUTCMinutes()}`
        if (!result[index]){
            result[index]=[]
        }    
        
        if (dat.args==200){
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
    
export default get_hour_timechart