import {Service} from '../../models'

async function update_service(name, page){
    let now = new Date()
    let service = await Service.findOne({name:name})
    let result = {timestamp:now.getTime(),avg:page.response_time,args:page.response_status}
    delete service.__v
    if (service){
        let service_page = service.pages.find(x=>x.name==page.name)
        if (service_page){
            let last_minute_data = service_page.data.find(x=>(~~((now.getTime()-x.timestamp)/(1000*60))==0)&&(x.args==result.args))
            if (last_minute_data){
                if (result.avg){
                    last_minute_data.avg = ~~((last_minute_data.avg+result.avg)/2)
                }       
            }
            else{
                if(result.avg&&result.timestamp){
                    service_page.data.push(result)
                }
            }
            
        }else{
            
            service.pages.push({
                name:page.name,
                data:[result]
            })
        }
        await service.save()     
    }
    else{   
        service = new Service({
            name: name,
            pages:[{
                name:page.name,
                data:[result]
            }]
        })
        await service.save()
    }	
}

export {update_service}