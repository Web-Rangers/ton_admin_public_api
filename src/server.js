process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const axios = require('axios')
axios.default.defaults.baseURL = config.API_URL
axios.default.defaults.headers.post['Content-Type'] = 'application/json';
axios.default.defaults.headers.common['Authorization'] = "token " + config.TOKEN
let express = require('express')
const config = require('./config')


module.exports = async function start_server() {
    let app = express()
    
    app.listen(config.PORT,()=>{

    }) 

}