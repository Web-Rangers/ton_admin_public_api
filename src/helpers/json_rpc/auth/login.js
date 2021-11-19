const {sendJRPC} = require('../send_jrpc')
let config = require('../../../config')

async function login() {
    let result = await sendJRPC('/','login',[config.NODE_URL,config.PASSWRD]) 
    config.TOKEN = result.data.result.token
    
    return {'status':'logged'}  
}

module.exports = {login}