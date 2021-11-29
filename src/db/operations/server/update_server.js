import {Server} from '../../models'
const steps = ['years','months','days']

async function update_server(ip,port, time){
    let now = new Date()
    let server = await Server.findOne({ip:ip,port:port})
    let result = {timestamp:now.getTime(),avg:time,args:time?true:false}
    if (server){
        let year = await server.years.find(x=>x.year == now.getUTCFullYear())
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
                        if(result.avg&&result.timestamp){
                            day.data.push(result)
                        }
                        
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
            server.years.push(years)
        }

        await server.save()     
    }
    else{
        let years = calc_step_object('',result,now)
        server = new Server({
            ip: ip,
            port:port, 
            years:[years]  
        })
        console.log('aaaaaaaaaaaa');
        await server.save()
    }	
}
function calc_step_object(step_data,result_value,now) {
    
    let date_time = {year:now.getUTCFullYear(),month:now.getMonth(), day:now.getDate()}

    let index = steps.indexOf(step_data)+1

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
export {update_server}