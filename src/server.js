
let express = require('express')
let {build_routes} = require('./build_routes')
let config = require('./config')

module.exports = function start_server() {
    let app = express()
    build_routes(app)
    app.listen(config.PORT || 4000,()=>{

    }) 

}