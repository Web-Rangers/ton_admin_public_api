
import {Service} from'../../../db/models'

async function get_month_timechart(service_name,page_name) {
    let current_date = new Date()
    let [cur_year,cur_month,cur_day]=[current_date.getUTCFullYear(),current_date.getMonth(),current_date.getDate()]

    let service = await Service.findOne({'name':service_name})  
    
    let page = service.pages.find(x=>x.name==page_name)

    let year = page.years.find(x=>x.year==cur_year)
    let this_months = year.months.find(x=>x.month==cur_month)
    console.log(this_months.days);
    let days = this_months.days.filter(x=>x.day<=cur_day)
    console.log(this_months);
    let result = calc_days(days,year,cur_month)
    
    if (cur_day-30<0){
        if (cur_month==0){
            year = page.years.find(x=>x.year==cur_year-1)
            this_months = year.months.filter(x=>x.month==(cur_month-1))
            days = this_months.days.filter(x=>x.day>=30-cur_day)
            result = Object.assign(calc_days(days,year,cur_month),result)
        }
        else{
            this_months = year.months.find(x=>x.month==(cur_month-1))
            if(this_months){
                console.log(result);
                days = this_months.days.filter(x=>x.day>=30-(30-cur_day))
                result = Object.assign(calc_days(days,year,cur_month),result)
            }
            
        }
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
        for (let i = 0; i < day.data.length; i++) {
            if (day.data[i].args==200){
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
    
export default get_month_timechart