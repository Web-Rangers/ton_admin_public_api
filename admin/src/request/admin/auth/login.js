import axios from 'axios'


async function tonadmin_login(login_data){
    let {params} = {...login_data}
    let headers = {
        'Content-Type': 'application/json'
    }
    return axios.post(
        params[0]+'/',
        JSON.stringify({jsonrpc: "2.0", id: 0, method: 'login', params: params}),{headers:headers}
    )
}

export {tonadmin_login}
