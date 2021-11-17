var config = require('./config.json');
const dotenv = require('dotenv').config()
var Observer = require('./ServicesObserver');

const WebSocket = require('ws');

async function main(){
  const wsServer = new WebSocket.Server({ port: dotenv.parsed.WS_PORT || 3000 });

  let observer = new Observer(config)

  let lastData = await observer.checkServices();

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
    let data = JSON.stringify(await observer.checkServices())
    console.log("data fetched");
    lastData = data;
      for (const wsClient of wsServer.clients) {
          wsClient.send(data)
      }
  }, dotenv.parsed.WS_INTERVAL || 30000);
}
main();