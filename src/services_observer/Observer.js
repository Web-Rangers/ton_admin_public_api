const axios = require('axios');
class Observer {
    constructor(services) {
      this.services = services;
    }

    async checkServices(){
        let result_services = this.services
        for (const service of result_services) {
            for (const page of service.pages) {
                
                var start = new Date();
                let response = await axios.get(page.url, {
                    validateStatus: function (status) {
                      return status < 1000; // Resolve only if the status code is less than 1000
                    }
                  })
                var end = new Date();
               
                
                if(response.status == 200){
                    page.response_status = response.status
                    page.response_time = end - start
                }
                else{
                    //telegram alert
                    page.response_status = response.status
                    page.response_time = end - start
                }
            }
        }
        return result_services
    }
  }
  module.exports = Observer;