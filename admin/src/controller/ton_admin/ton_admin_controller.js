import {admin_service} from '../../request'
import {auth_service} from '../../helpers'

const build_admin_controller = function() {
    return ({
        login,
        logout,
        proxy_request
    })
    async function login(request) {
        let res = await admin_service.tonadmin_login(request.body)
        let jsonrpc_token = res.data.result.token
        let api = res.data.result.api
        console.log(res);
        if (jsonrpc_token){
            return {status:200,message:'logged',result:{token:await auth_service.login(jsonrpc_token,api)}}
        }
        return {status:400,message:'invalid credentials or server are not available'}
    }
    async function logout(request) {
        return {status:200,message:{dhtservers:server_service.get_dhtservers()}}
    }
    async function proxy_request(request) {
        if (request.headers['authorization']){
            let verify_token = await auth_service.check(request.headers['authorization'])
            if (verify_token){
                console.log(verify_token);
                request.body.token = verify_token.token
                request.body.url = verify_token.url
                let result = await admin_service.tonadmin_proxy(request)
                if (result.data.error){
                    return{status:400,message:result.data.error, result:{}}
                }
                return{status:200,message:'sucess', result:result.data.result}
            }
            else{
                return{status:403,message:'invalid token', result:{}} 
            }  
        }
        return{status:401,message:'unautorized', result:{}}
    }
}

export {
    build_admin_controller
}