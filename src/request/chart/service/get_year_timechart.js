
import {Service} from'../../../db/models'

async function get_year_timechart(service_name,page_name) {
    let current_date = new Date()
    let [cur_year,cur_month]=[current_date.getUTCFullYear(),current_date.getMonth()]

    let service = await Service.findOne({'name':service_name})  
    let page = service.pages.find(x=>x.name==page_name)

    let year = page.years.find(x=>x.year==cur_year)
    let year_months = year.months.filter(x=>x.month<=cur_month)

    let result = calc_month(year_months,year)
    
    if (cur_month-12<0){
        year = page.years.find(x=>x.year==cur_year-1)
        if(year){
            year_months = year.months.filter(x=>x.month>=(12-cur_month))
            result = [calc_month(year_months,year),...result]
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
    }
    return result
}
    
export default get_year_timechart