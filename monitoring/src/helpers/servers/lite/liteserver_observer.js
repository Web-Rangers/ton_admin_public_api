import axios from 'axios'
import tcpp from 'tcp-ping'
import {status} from '../../../data/json_rpc_status'
import {update_server} from '../../../db/operations/server'

class LiteServerObserver {

    constructor(config) 
    {
      this.config = config;
      this.liteservers;
      this.check_liteservers = this.check_liteservers.bind(this)
    }

    static async build (config_url) {
        let config =  await axios.get(config_url)
        let observer = new LiteServerObserver(config)
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

    async check_liteservers() 
    {
        let servers = []
        for (const server of this.liteservers) 
        {
            tcpp.ping({ address: server.ip, port:server.port, attempts:5}, function(err, data) {
                server.time = data.avg
                servers.push(server)
                status.update_status({liteservers:servers})
                update_server(server.ip, server.port, server.time)
            });
        }
    }
}

export {LiteServerObserver}