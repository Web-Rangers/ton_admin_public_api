const {DHTServerObserver} = require('./dht/dht_servers_observer')
const {LiteServerObserver} = require('./lite/liteserver_observer')

class ObserverMonitor{
    async create_observers(){
        //this.dht = await DHTServerObserver.build(process.env.DHTSERVER_CONFIG_URL)
        this.lite = await LiteServerObserver.build(process.env.LITESERVER_CONFIG_URL)
    }
    async fetch_data(){
        //await this.dht
        await this.lite.check_liteservers()
    }
}
const servers_monitor = new ObserverMonitor()
module.exports = {servers_monitor}