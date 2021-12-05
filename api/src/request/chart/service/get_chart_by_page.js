
import {Service,ServiceData} from'../../../db/models'

async function get_chart_by_page(service_name,page_name,time_period = 'h',time_value=1) {
    //hour
    let time_argument = 1000*60
    let index_argument = 60
    switch (time_period) {
        case 'd':
            time_argument = time_argument*60
            index_argument = 24
            break;
        case 'm':
            time_argument = time_argument*60*24
            index_argument=30
            break;
        case 'y':
            time_argument = time_argument*60*24*30
            index_argument=12
            break;
        default:
            break;
    }
 
    let current_date = new Date()
    let service = await Service.findOne({'name':service_name})
    let page = service.pages.find(x=>x.name==page_name)
    let data =(await ServiceData.find({page_name:page_name,service:service._id})).filter(x=>(((current_date.getTime()-x.timestamp)/(time_argument)))<=(index_argument*time_value))

    let result = {}
    for (let dat of data) {
        
        let index = `${~~((current_date.getTime()-dat.timestamp)/(time_argument))}`
        if (!result[index]){
            result[index]=[]
        }    
        
        if (dat.args==200){
            let length = result[index].length-1
            if(result[index][length]&&result[index][length]!=0){
                result[index][length] = (result[index][length]+dat.avg)/2
            }
            else{
                result[index].push(dat.avg)   
            }
        }
        else{
            result[index].push(0)  
        }
            
    } 
    return result
}
  
export default get_chart_by_page