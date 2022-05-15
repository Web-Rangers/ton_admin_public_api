import {admin_service} from '../../request'
import {auth_service} from '../../helpers'
import fetch from "node-fetch";

const build_admin_controller = function() {
    return ({
        login,
        logout,
        proxy_request
    })

    async function validateRecaptcha(recaptchaToken, expectedAction){
       const threshold = 0.3;
        const recaptchaSecret = process.env.RECAPTCHA_SECRET;
       const url = `https://www.recaptcha.net/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;
        let valid = false;
        await fetch(url, {method: 'post'})
            .then((response) => response.json())
            .then((data)=> {
                valid = (data.success && data.score && data.action && data.score >= threshold && data.action === expectedAction);
            })
        return valid;
     }

     async function login(request) { // getting request from frontend
       let req = request.body

          // Getting recaptcha token
          let gtoken = req.params[2]
          let captcha = await validateRecaptcha(gtoken, 'login')
          req.params.splice(2, 1)

          if (!captcha) return { status: 403, message: 'ReCaptcha solved incorrectly' }

          // Sending request to mtc-jsonrpc
          let res = await admin_service.tonadmin_login(req)

          if(res.data.error){
            return { status: res.data.error.code, message: res.data.error.message }
          }

          if (res.data.result && res.data.result.token){
              return { status: 200, message: 'OK', result: {token: await auth_service.login(res.data.result.token, res.data.result.api)}}
          }

        return { status: 400, message: 'Bad Request' }
    }

    async function logout(request) {
        return { status: 200, message: { dhtservers: server_service.get_dhtservers() }}
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
