process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
import start_server from'./server'
async function start(){
    
    start_server()
}

start()
