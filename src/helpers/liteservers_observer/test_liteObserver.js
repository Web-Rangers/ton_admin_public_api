const axios = require('axios');
var tcpp = require('tcp-ping');
let {liteservers_observer} = require('./LiteserversObserver');
const dotenv = require('dotenv').config()


async function main(){
    setInterval(async () => {
        await liteservers_observer.check_liteservers()
    }, 15000)
}

main()