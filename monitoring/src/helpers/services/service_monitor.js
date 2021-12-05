import axios from 'axios'
import config from './config.json'
import {status} from '../../data/json_rpc_status'
import {update_service} from '../../db/operations/service'
class ServicesObserver {
    constructor() {
      this.services = config;
    }

    async checkServices(){
        let result_services = this.services
        for (const service of result_services) {
            for (const page of service.pages) {
                let response
                let start = new Date();
                try {
                  response = await axios.get(page.url, {
                    validateStatus: async function (stat) {
                      var end = new Date();
               
                      page.response_status = stat
                      page.response_time = end - start 
                      await update_service(service.service_name,page);
                      status.update_status({services:result_services})
                    }
                })
                } catch (error) {
                  console.log(error);
                }
                
                
            }
        }
       
    }
  }
  const service_monitor = new ServicesObserver()
  export{service_monitor};