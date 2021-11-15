var config = require('./config.json');
const dotenv = require('dotenv').config()
var Observer = require('./Observer');

const WebSocket = require('ws');


const wsServer = new WebSocket.Server({ port: dotenv.parsed.WS_PORT || 3000 });

let observer = new Observer(config)
wsServer.on('connection', function(ws) {

    console.log("новое соединение");
  
    ws.on('message', function(message) {});

    ws.on("error", (err) => {
        console.log(err.stack);
      });
  
    ws.on('close', function() {
      console.log('соединение закрыто');
    });
  
  });
setInterval(async() => {
    for (const wsClient of wsServer.clients) {
        wsClient.send(JSON.stringify(await observer.checkServices()))
    }
}, dotenv.parsed.WS_INTERVAL || 30000);


