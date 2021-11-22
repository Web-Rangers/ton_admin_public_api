const dotenv = require('dotenv').config()
const WebSocket = require('ws');
const {emitter} = require('./data/json_rpc_status')

module.exports = async function start_wsserver()
{
    const wsServer = new WebSocket.Server({ port: dotenv.parsed.WS_PORT || 3000 });
    let lastData = {}

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