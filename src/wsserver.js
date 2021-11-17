const dotenv = require('dotenv').config()
const WebSocket = require('ws');
var ServicesObserver = require('./services_observer/ServicesObserver');
var LiteserverObserver = require('./liteservers_observer/LiteserversObserver');

module.exports = async function start_wsserver()
{
    const wsServer = new WebSocket.Server({ port: dotenv.parsed.WS_PORT || 3000 });

    let servicesObserver = new ServicesObserver()
    let liteserversObserver = await LiteserverObserver.build(dotenv.parsed.LITESERVER_CONFIG_URL)
 
    let lastData = JSON.stringify({
        services: await servicesObserver.checkServices(), 
        liteservers: liteserversObserver.liteservers
    });

    wsServer.on('connection', function(ws) {

        console.log("New connection!");

        ws.send(lastData);

        ws.on('message', function(message) {});

        ws.on("error", (err) => {
            console.log(err.stack);
        });

        ws.on('close', function() {
            console.log('Connection closed');
        });
    });

    setInterval(async () => {

        console.log("fetching data...");
    
        await liteserversObserver.check_liteservers()
    
        lastData = JSON.stringify({
          services: await servicesObserver.checkServices(), 
          liteservers: liteserversObserver.liteservers
        });
    
        console.log("data fetched!");
        for (const wsClient of wsServer.clients) {
            wsClient.send(lastData)
            console.log("data sended");
        }
      }, dotenv.parsed.WS_INTERVAL || 30000)
}