import {Server} from '../../models'

async function update_server(ip, port, time){
    let now = new Date()
    let server = await Server.findOne({ip:ip,port:port})
    delete server.__v
    let result = {timestamp:now.getTime(),avg:time,args:time?true:false}
    if (server){
        try {
            let last_minute_data = server.data.find(x=>(~~((now.getTime()-x.timestamp)/(1000*60))==0)&&(x.args==result.args))
            if (last_minute_data){
                if (result.avg){
                    last_minute_data.avg = ~~((last_minute_data.avg+result.avg)/2)
                }       
            }
            else{
                if(result.avg&&result.timestamp){
                    server.data.push(result)
                }
            }
                
            await server.save()
            } catch (error) {
                console.log(error);
            }
             
        }
        else{   
            server = new Server({
                ip:ip,
                port:port,
                data:[result]
            })
        await server.save()
    }	
}

export {update_server}