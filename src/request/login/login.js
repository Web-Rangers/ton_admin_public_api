const {sendJRPC} = require('../../helpers/jsonrpc')
let config = require('../../config')

async function login() {
    let result = await sendJRPC('/','login',[config.NODE_URL,config.PASSWRD]) 
    console.log(result);
    config.TOKEN = result.data.result.token
    
    return {'status':'logged'}  
}

module.exports = {login}