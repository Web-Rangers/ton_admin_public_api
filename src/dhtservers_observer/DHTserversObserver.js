const axios = require('axios');
var tcpp = require('tcp-ping');

class DHTserverObserver {
    constructor(config) {
      this.config = config;
      this.dhtservers;
    }

    static async build (config_url) {
        let config =  await axios.get(config_url)
        let observer = new DHTserverObserver(config)
        observer.dhtservers = observer.get_dhtservers(observer.config)
        await observer.check_dhtservers()
        return observer;
    }

    hex2dotted(ip) {
        ip = parseInt(ip, 16)
        let brackets = []
        for(var i = 0; i < 4; i++){
            brackets[i] = (ip >> 8*(3 - i)) & 0xFF
        }
        return brackets.join(".")
    }

    get_dhtservers(config) {
        let ip_arr = []
        let hexString
        for (const dhtserver of config.data.dht) {
            hexString = dhtserver.ip.toString(16);
            ip_arr.push({ip: this.hex2dotted(hexString), port: dhtserver.port, time:0})
        }
        return ip_arr;
    }

    async check_dhtservers() {
        for (const server of this.dhtservers) 
        {
            tcpp.ping({ address: server.ip, port:server.port, attempts:1}, function(err, data) {
                server.time = data.avg
            });
        }
    }
  }
  module.exports = DHTserverObserver;