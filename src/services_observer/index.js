var request = require('request');
var config = require('./config.json');
var Observer = require('./Observer');



async function main(){

    let observer = new Observer(config)
    for (const obj of await observer.checkServices()) {
        for (const page of obj.pages) {
            console.log(page)
        }
    }
    
}
setInterval(main, 10000)