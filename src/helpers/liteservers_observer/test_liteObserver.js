const axios = require('axios');
var tcpp = require('tcp-ping');
var Observer = require('./LiteserversObserver');
const dotenv = require('dotenv').config()


async function main(){

    let observer = new Observer()
    await observer.configure(dotenv.parsed.LITESERVER_CONFIG_URL)

    setInterval(async () => {
        await observer.check_liteservers()
        console.log(observer.liteservers);
    }, 15000)
}

main()