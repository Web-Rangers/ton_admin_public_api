const axios = require('axios');
var tcpp = require('tcp-ping');

class LiteserverObserver {
    constructor(config) 
    {
      this.config = config;
      this.liteservers;
    }

    static async build (config_url) {
        let config =  await axios.get(config_url)
        let observer = new LiteserverObserver(config)
        observer.liteservers = observer.get_liteservers(observer.config)
        await observer.check_liteservers()
        return observer;
    }

    hex2dotted(ip)
    {
        ip = parseInt(ip, 16)
        let brackets = []
        for(var i = 0; i < 4; i++){
            brackets[i] = (ip >> 8*(3 - i)) & 0xFF
        }
        return brackets.join(".")
    }

    get_liteservers(config)
     {
        let ip_arr = []
        let hexString
        for (const liteserver of config.data.liteservers) {
            hexString = liteserver.ip.toString(16);
            ip_arr.push({ip: this.hex2dotted(hexString), port: liteserver.port, time:0})
        }
        return ip_arr;
    }

    // async  configure(config_url)
    // {
    //     this.config =  await axios.get(config_url)
    //     this.liteservers = this.get_liteservers(this.config)
    //     await this.check_liteservers()
    // }

    async check_liteservers() 
    {
        for (const server of this.liteservers) 
        {
            tcpp.ping({ address: server.ip, port:server.port, attempts:1}, function(err, data) {
                server.time = data.avg
            });
        }
    }
  }
  module.exports = LiteserverObserver;