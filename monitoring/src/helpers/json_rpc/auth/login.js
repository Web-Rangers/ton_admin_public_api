import {sendJRPC} from '../send_jrpc'
import config from '../../../config'

async function login() {
    let result = await sendJRPC('/','login',[config.NODE_URL,config.PASSWRD]) 
    config.TOKEN = result.data.result.token
    
    return {'status':'logged'}  
}

export {login}