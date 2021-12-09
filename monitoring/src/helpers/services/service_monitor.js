import axios from 'axios'
import config from './config.json'
import {status} from '../../data/json_rpc_status'
import {update_service} from '../../db/operations/service'
class ServicesObserver {
    constructor() {
      this.services = config;

      axios.interceptors.request.use(function (config) {
        config.metadata = { startTime: new Date()}
          return config;
        }, function (error) {
          return Promise.reject(error);
      });

      axios.interceptors.response.use(function (response) {
        response.config.metadata.endTime = new Date()
        response.duration = response.config.metadata.endTime - response.config.metadata.startTime
        return response;
      }, function (error) {
        error.config.metadata.endTime = new Date();
        error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
        return Promise.reject(error);
      });
    }

    async checkServices(){
        let result_services = this.services
        for (const service of result_services) {
            for (const page of service.pages) {
                let start = new Date();
                let response = {};
                try {
                  response = await axios.get(page.url, {
                    validateStatus: async function (stat) {
                      return stat<1000
                    }
                    
                    
                  })
                } catch (error) {
                  console.log(error);
                }

                //console.log(response.duration);
                page.response_status = response.status
                page.response_time = response.duration
                await update_service(service.service_name,page);
                status.update_status({services:result_services})

            }
        }
       
    }
  }
  const service_monitor = new ServicesObserver()
  export{service_monitor};