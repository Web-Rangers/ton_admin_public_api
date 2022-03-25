import {sendJRPC} from '../send_jrpc'
import {config} from '../../../config'
import { response } from 'express'

async function login() {
    let result = await sendJRPC('/','login',[config.NODE_URL,config.PASSWRD])
    console.log(result.data);
    if(result){
        config.TOKEN = result.data.result.token
        return {'status':'logged'} 
    }else{
        return {'status':'sometthing went wrong'}
    }
    
    
      
}

export {login}