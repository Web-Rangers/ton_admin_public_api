const dotenv = require('dotenv').config()
const WebSocket = require('ws');
const {emitter} = require('./data/json_rpc_status')

module.exports = async function start_wsserver()
{
    const wsServer = new WebSocket.Server({ port: dotenv.parsed.WS_PORT || 3000 });
    let lastData = {}
    // let lastData = JSON.stringify({
    //     services: await servicesObserver.checkServices(), 
    //     liteservers: liteserversObserver.liteservers,
    //     elections: metrics_service.get_elections_data(),
    //     complaints: metrics_service.get_complaints(),
    //     blocks_rate:metrics_service.get_blocks_rate(),
    //     validators: metrics_service.get_validators(),
    //     offers: metrics_service.get_offers(),
    //     bridge:{
    //         eth:bridge_service.get_eth_status(),
    //         bsc:bridge_service.get_bsc_status(),
    //     }
    // });

    wsServer.on('connection', function(ws) {

        console.log("New connection!");

        ws.send(JSON.stringify(lastData));

        ws.on('message', function(message) {});

        ws.on("error", (err) => {
            console.log(err.stack);
        });

        ws.on('close', function() {
            console.log('Connection closed');
        });
    });
    emitter.on('data_change',(data)=>{
        lastData = data
        for (const wsClient of wsServer.clients) {
            wsClient.send(JSON.stringify(data)) 
        }
    })
}