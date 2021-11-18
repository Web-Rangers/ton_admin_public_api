const dotenv = require('dotenv').config()
const WebSocket = require('ws');
var ServicesObserver = require('./services_observer/ServicesObserver');
var LiteserverObserver = require('./liteservers_observer/LiteserversObserver');
var DHTserversObserver = require('./dhtservers_Observer/DHTserversObserver');
let {metrics_service,bridge_service, interval_service} = require('./request')

module.exports = async function start_wsserver()
{
    const wsServer = new WebSocket.Server({ port: dotenv.parsed.WS_PORT || 3000 });

    let servicesObserver = new ServicesObserver()
    let liteserversObserver = await LiteserverObserver.build(dotenv.parsed.LITESERVER_CONFIG_URL)
    let dhtserversObserver = await DHTserversObserver.build(dotenv.parsed.LITESERVER_CONFIG_URL)
 
    let lastData = JSON.stringify({
        services: await servicesObserver.checkServices(), 
        liteservers: liteserversObserver.liteservers,
        dhtservers: dhtserversObserver.dhtservers,
        elections: metrics_service.get_elections_data(),
        complaints: metrics_service.get_complaints(),
        blocks_rate:metrics_service.get_blocks_rate(),
        validators: metrics_service.get_validators(),
        offers: metrics_service.get_offers(),
        bridge:{
            eth:bridge_service.get_eth_status(),
            bsc:bridge_service.get_bsc_status(),
        }
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
        await dhtserversObserver.check_dhtservers()
    
        lastData = JSON.stringify({
          services: await servicesObserver.checkServices(), 
          liteservers: liteserversObserver.liteservers,
          dhtservers: dhtserversObserver.dhtservers,
          elections: metrics_service.get_elections_data(),
          complaints: metrics_service.get_complaints(),
          blocks_rate:metrics_service.get_blocks_rate(),
          validators: metrics_service.get_validators(),
          offers: metrics_service.get_offers(),
          bridge:{
            eth:bridge_service.get_eth_status(),
            bsc:bridge_service.get_bsc_status(),
        }
        });
    
        console.log("data fetched!");
    }, dotenv.parsed.WS_INTERVAL || 15000)

    setInterval(async () => {
        for (const wsClient of wsServer.clients) {
            wsClient.send(lastData) 
        }
        console.log("data sended");
    }, dotenv.parsed.WS_SEND_INTERVAL || 15000)
}