
let express = require('express')
let {build_routes} = require('./app_routes')
let {build_uses} = require('./app_uses')
let config = require('./config')

module.exports = function start_server() {
    let app = express()
    build_uses(app)
    build_routes(app)
    app.listen(config.PORT,()=>{

    }) 

}