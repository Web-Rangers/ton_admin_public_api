const axios = require('axios');
var tcpp = require('tcp-ping');
var Observer = require('./DHTserversObserver');
const dotenv = require('dotenv').config()


async function main(){

    let observer = new Observer()
    await observer.configure(dotenv.parsed.DHTSERVER_CONFIG_URL)

    setInterval(async () => {
        await observer.check_dhtservers()
        console.log(observer.dhtservers);
    }, 15000)
}

main()