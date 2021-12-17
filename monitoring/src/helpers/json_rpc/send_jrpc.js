import axios from 'axios'
import {config} from '../../config'

async function sendJRPC(url, data, params = {}){

    var instance = axios.create({
        validateStatus: function (status) {
            return status < 10000;
        }
    });

    let headers = {
        'Content-Type': 'application/json'
    }

    if (config.TOKEN.length>0){
        headers['Authorization'] = "token " + config.TOKEN
    }
    return instance.post(config.NODE_URL+url, JSON.stringify({jsonrpc: "2.0", id: 0, method: data, params: params}),
        {
            headers:headers
        }).catch(function (error) {
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log('Error', error.message);
            }
            console.log(error.config);
          });
};

export {sendJRPC}