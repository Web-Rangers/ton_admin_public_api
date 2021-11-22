let axios = require('axios')

async function tonadmin_login(login_data){
    let {login,password} = {...login_data}
    let headers = {
        'Content-Type': 'application/json'
    }
    return axios.post(
        login+'/',
        JSON.stringify({jsonrpc: "2.0", id: 0, method: 'login', params: [login,password]}),{headers:headers}
    )
}

module.exports = {tonadmin_login}