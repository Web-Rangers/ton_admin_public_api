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
                let response = {};
                try {
                  var start = new Date();
                  response = await axios.get(page.url, {
                    validateStatus: function (status) {
                      return status < 1000; // Resolve only if the status code is less than 1000
                    }
                  })
                  var end = new Date();
                } catch (error) {
                  console.log(page.url + " raise error");
                  var end = new Date();
                }
 
                page.response_status = response.status
                page.response_time = end - start
                await update_service(service.service_name,page);
            }
        }
        status.update_status({services:result_services})
    }
  }
  const service_monitor = new ServicesObserver()
  export{service_monitor};