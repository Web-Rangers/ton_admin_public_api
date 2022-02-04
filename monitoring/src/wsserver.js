
import WebSocket from 'ws';
import {emitter} from './data/json_rpc_status'
import {config} from './config'
import get_last_data from './helpers/status/get_slast_data'

export default async function start_wsserver()
{
    const wsServer = new WebSocket.Server({ port: config.PORT || 3000 });
    let lastData = await get_last_data()
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
        
        Object.keys(data).forEach(key=>{
            lastData[key] = data[key]
        })
        for (const wsClient of wsServer.clients) {
            wsClient.send(JSON.stringify(data)) 
        }
    })
}