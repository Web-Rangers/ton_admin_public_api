import {axios} from 'axios'

async function tonadmin_logout(){
    let headers = {
        'Content-Type': 'application/json'
    }
    return axios.post(
        login+'/',
        JSON.stringify({jsonrpc: "2.0", id: 0, method: 'logout', params: []}),{headers:headers}
    )
}

export {tonadmin_logout}