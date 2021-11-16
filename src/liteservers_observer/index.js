const axios = require('axios');
var tcpp = require('tcp-ping');



async function main(){

    function hex2dotted(ip)
    {
        ip = parseInt(ip, 16)
        brackets = []
        for(var i = 0; i < 4; i++){
            brackets[i] = (ip >> 8*(3 - i)) & 0xFF
        }
        return brackets.join(".")
    }

    async function get_config(config_url){
        return await axios.get(config_url)
    }

    function get_liteservers(config){
        var ip_arr = []
        for (const liteserver of config.data.liteservers) {
            hexString = liteserver.ip.toString(16);
            ip_arr.push({ip: hex2dotted(hexString), port: liteserver.port})
        }
        return ip_arr;
    }

    async function check_liteservers(liteservers) {
        for (const server of liteservers) {
            tcpp.ping({ address: server.ip, port:server.port}, function(err, data) {
                server.time = data.avg
            });
        }
        console.log(liteservers);
    }

    let config = await get_config("https://ton.org/global-config-wallet.json")
    let liteservers = get_liteservers(config)

    setInterval(async () => {
        await check_liteservers(liteservers)
      }, 15000)
}

main()