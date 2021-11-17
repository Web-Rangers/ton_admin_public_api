const {sendJRPC} = require('../jrpc')

async function get_validators() {
    let validators = await sendJRPC('/','status') 
    console.log(validators);
}

module.exports = {get_validators}