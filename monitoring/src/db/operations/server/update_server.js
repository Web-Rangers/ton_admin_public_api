import {database_config} from '../../dbaccess'

async function update_server(ip, port, time){
    let {Server,ServerData} = database_config.monitoring_conn.models
    let now = new Date()
    let server = await Server.findOne({ip:ip,port:port})
    
    if (!server){  
        server = new Server({
            ip:ip,
            port:port
        })
        await server.save()
    }
    if (time){
        let result = {timestamp:now.getTime(),avg:time,args:time?true:false}

        let data =await ServerData.findOne({server:server._id,args:result.args,$where:function(){
            let now = new Date()
            return (~~((now.getTime()-this.timestamp)/(1000*60))==0)  
        }})
        if (data){
            data.avg=~~((data.avg+result.avg)/2)
            await data.save()      
        }
        else{
            data = new ServerData({
                server:server,
                timestamp:result.timestamp,
                avg:result.avg,
                args:result.args
            }) 
            await data.save()
        } 
    }
    
}

export {update_server}