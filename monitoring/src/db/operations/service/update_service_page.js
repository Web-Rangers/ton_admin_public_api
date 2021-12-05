import {Service,ServiceData} from '../../models'

async function update_service(name, page){
    let now = new Date()
    let service = await Service.findOne({name:name})
    
    if (!service){   
        service = new Service({
            name: name,
            pages:[{
                name:page.name
            }]
        })
        await service.save()
    }
    let result = {timestamp:now.getTime(),avg:page.response_time,args:page.response_status}
    
    let service_page = service.pages.find(x=>x.name==page.name)
    if (!service_page){
        service.pages.push({
            name:page.name
        })
        service_page = service.pages.find(x=>x.name==page.name)
    }

    let data = await ServiceData.findOne({service:service._id,page_name:service_page.name,args:result.args,$where:function(){
        let now = new Date()
        return (~~((now.getTime()-this.timestamp)/(1000*60))==0)  
    }})
    if (data){
        data.avg=~~((data.avg+result.avg)/2)
        await data.save()      
    }
    else{
        data = new ServiceData({
            service:service,
            page_name:service_page.name,
            timestamp:result.timestamp,
            avg:result.avg,
            args:result.args
        }) 
        await data.save()
    } 
}

export {update_service}