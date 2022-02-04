import async_connection from '../../db/dbaccess/async_connection'

async function get_last_data(){
    let last_data = {
        services:[],
        offers:[],
        liteservers:[],
        complaints:[],
        validators:[],
        electionId:0, 
        totalValidators:0, 
        onlineValidators:0, 
        startValidation:0, 
        endValidation:0, 
        startNextElection:0, 
        endElection:0, 
        last_block:0, 
        tpsAvg:0, 
        startElection:0
    }
    let data = await async_connection.connection.execute('select electionId, totalValidators, onlineValidators, startValidation, endValidation, startNextElection, endElection, last_block, tpsAvg, startElection from status limit 1')

    Object.keys(data[0][0]).forEach(x=>{
        last_data[x] = data[0][0][x] 
    });
   
    data = await async_connection.connection.execute('SELECT * FROM status_complains');
    last_data.complaints = data[0];
    data = await async_connection.connection.execute('SELECT * FROM status_liteservers');
    last_data.liteservers = data[0];
    data = await async_connection.connection.execute('SELECT * FROM status_offers;');
    last_data.offers = data[0];
    data = await async_connection.connection.execute('SELECT * FROM status_validators;');
    last_data.validators = data[0];
    data = await async_connection.connection.execute('SELECT * FROM status_services;');
    for (let service of data[0]) {
        let exitst = last_data.services.indexOf(service.service_name)
        if (exitst!=-1){
            last_data.services[exitst].pages.push({name:service.page_name, response_status:service.status_code, response_time:service.latency})
        }
        else{
            last_data.services.push({service_name: service.service_name,
            pages:[{name:service.page_name, response_status:service.status_code, response_time:service.latency}]})  
        }
    }
    return last_data
    
}

export default get_last_data