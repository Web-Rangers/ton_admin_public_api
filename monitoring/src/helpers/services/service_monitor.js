import axios from 'axios'
import config from './config.json'
import {emitter, status} from '../../data/json_rpc_status'
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
                  headers:{'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'},
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
          }
      }
      emitter.emit('data_change',{services:result_services})
    }
  }
  const service_monitor = new ServicesObserver()
  export{service_monitor};