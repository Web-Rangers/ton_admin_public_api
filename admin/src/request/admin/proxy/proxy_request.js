import {axios} from 'axios'

async function tonadmin_proxy(request_params){
    let headers = {
        'Content-Type': 'application/json'
    }
    let {token,url,jsonrpc,id,method,params} = {...request_params.body}
    if (token){
        headers['Authorization'] = "token " + token
    }
    return axios.post(
        url+'/',
        JSON.stringify({jsonrpc: jsonrpc, id: id, method: method, params: params}),{headers:headers}
    )
}

export {tonadmin_proxy}