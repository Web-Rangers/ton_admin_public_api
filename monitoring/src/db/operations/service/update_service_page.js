import db_connection from '../../dbaccess/db_connection'

async function update_service(name, page){
    let timestamp = Math.round(new Date().getTime()/1000)
    if (page.response_time&&page.response_status){
        db_connection.connection.execute(`INSERT INTO status_services (service_name,page_name,time,latency,status_code) values ('${name}','${page.name}',${timestamp},${page.response_time},${page.response_status}) ON DUPLICATE KEY UPDATE time=${timestamp},latency=${page.response_time},status_code=${page.response_status}`,(err,res)=>{if(err)console.log(err);})  
        db_connection.connection.execute(`INSERT INTO service_ping (service_name,page_name,time,latency,status_code) values ('${name}','${page.name}',${timestamp},${page.response_time},${page.response_status});`,(err,res)=>{if(err)console.log(err);}) 
    }
   }

export {update_service}