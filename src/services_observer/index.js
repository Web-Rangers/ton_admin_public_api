var config = require('./config.json');
var Observer = require('./Observer');

const WebSocket = require('ws');


const wsServer = new WebSocket.Server({ port: 3000 });

let observer = new Observer(config)
var clients = []
wsServer.on('connection', function(ws) {

    var id = Math.random();
    clients[id] = ws;
    console.log("новое соединение " + id);
  
    ws.on('message', function(message) {});

    ws.on("error", (err) => {
        console.log(err.stack);
      });
  
    ws.on('close', function() {
      console.log('соединение закрыто ' + id);
      delete clients[id];
    });
  
  });
setInterval(async() => {
    for (const wsClient of wsServer.clients) {
        wsClient.send(JSON.stringify(await observer.checkServices()))
    }
}, 10000);


