const https = require('https')
const axios = require('axios')
const fs = require('fs')

async function sendJRPC (url, data, params = {}){
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false, // (NOTE: this will disable client verification)
        requestCert: true,
    })
    return axios.post(
        url,
        JSON.stringify({jsonrpc: "2.0", id: 0, method: data, params: params}, {httpsAgent}
        
        ),
        
    )
};

module.exports = {sendJRPC}