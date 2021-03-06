import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcrypt'


class AuthService{
    async login(jsonrpc_token,url){
        let salt = await bcrypt.genSalt(Math.random()*10)
        return jwt.sign({token:jsonrpc_token,url:url,salt:salt},process.env.SECREET,{expiresIn:'24h'})
    }

    logout(jsonrpc_token){
        jwt.sign({token:jsonrpc_token,salt:salt},process.env.SECREET,{expiresIn:'1s'}) 
        return {}
    }

    async check(token){
        try{
           let res = await jwt.verify(token,process.env.SECREET) 
           return res
        }
        catch (e){
            return undefined
        }
    }
}
const auth_service = new AuthService()
export {AuthService,auth_service}