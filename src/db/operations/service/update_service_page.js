import {Service} from '../../models'
const steps = ['years','months','days']

async function update_service(name, page){
    let now = new Date()
    let service = await Service.findOne({name:name})
    let result = {timestamp:now.getTime(),avg:page.response_time,args:page.response_status}
    if (service){
        let page_ = service.pages.find(x=>x.name==page.name)
        if (page_){
            let year = await page_.years.find(x=>x.year == now.getUTCFullYear())
            if (year){ 
                let month = await year.months.find(x=>x.month == now.getMonth())
                if (month){
                    let day = await month.days.find(x=>x.day == now.getDate())
                    if(day){
                        let res_ = day.data.find(x=>(~~((now.getTime()-x.timestamp)/(1000*60))==0)&&(x.args==result.args))
                        if (res_){
                            res_.avg = ~~((res_.avg+result.avg)/2)      
                        }
                        else{
                            day.data.push(result)
                        }
                    }
                    else{
                        let days = calc_step_object('months',result,now)
                        month.days.push(days) 
                    }   
                }
                else{
                    let months = calc_step_object('years',result,now)
                    year.months.push(months)
                }    
            }
            else{
                let years = calc_step_object('',result,now)
                page_.years.push(years)
            }
        }else{
            
            let years = calc_step_object('',result,now)
            service.pages.push({
                name:page.name,
                years:[years]
            })
        }
        await service.save()     
    }
    else{
        let years = calc_step_object('',result,now)
        service = new Service({
            name: name,
            pages:[{
                name:page.name,
                years:[years]
            }]
        })
        await service.save()
    }	
}
function calc_step_object(step_data,result_value,now) {
    
    let date_time = {year:now.getUTCFullYear(),month:now.getMonth(), day:now.getDate()}

    let index = steps.indexOf(step_data)
    let step_map = steps.slice(index>=0?index:0,steps.lastIndex)
    
    let object = {}
    object['data'] = [result_value]
    object['day']=date_time['day']
    for (let i = step_map.length-2; i >=0; i--) {
        let slice = step_map[i].slice(0,step_map[i].length-1)
        object = {
            [slice]:date_time[slice],
            [step_map[i+1]]:object
        }
    }
    return object
}
export {update_service}