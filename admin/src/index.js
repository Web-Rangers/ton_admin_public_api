process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const start_server = require('./server')

async function start(){
    start_server()
}
start()
