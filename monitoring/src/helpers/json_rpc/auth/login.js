import {sendJRPC} from '../send_jrpc'
import {config} from '../../../config'
import { response } from 'express'

async function login() {
    let result = await sendJRPC('/','login',[config.NODE_URL,config.PASSWRD])
    if(result){
        config.TOKEN = result.data.result.token
        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!login OK");
        return {'status':'logged'} 
    }else{
        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!login NOT OK");
        return {'status':'sometthing went wrong'}
    }
    
    
      
}

export {login}