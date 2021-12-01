import dotenv from'dotenv'
import WebSocket from 'ws';
import {emitter} from './data/json_rpc_status'
dotenv.config()

export default async function start_wsserver()
{
    const wsServer = new WebSocket.Server({ port: process.env.WS_PORT || 3000 });
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