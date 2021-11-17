var config = require('./config.json');
const dotenv = require('dotenv').config()
var ServicesObserver = require('./ServicesObserver');
var LiteserverObserver = require('../liteservers_observer/LiteserversObserver');
const {get_elections_data} = require('../request/validator')

const WebSocket = require('ws');

async function main(){
  const wsServer = new WebSocket.Server({ port: dotenv.parsed.WS_PORT || 3000 });

  let servicesObserver = new ServicesObserver(config)
  let liteserversObserver = new LiteserverObserver()
  liteserversObserver.configure(dotenv.parsed.LITESERVER_CONFIG_URL)
  
  let services = await servicesObserver.checkServices()
  let liteservers = liteserversObserver.liteservers
  let lastData = JSON.stringify({services: services, liteservers: liteservers});

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
    services = await servicesObserver.checkServices();
    liteservers = liteserversObserver.liteservers;

    console.log("data fetched!");

    lastData = JSON.stringify({services: services, liteservers: liteservers, elections: get_elections_data()});
    for (const wsClient of wsServer.clients) {
        wsClient.send(lastData)
    }
  }, dotenv.parsed.WS_INTERVAL || 30000)
}
main();