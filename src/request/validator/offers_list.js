const {sendJRPC} = require('../jsonrpc')

async function get_offers_list() {
    result = await sendJRPC('/','ol') 
    console.log(result.data.result);
    return {'validators': result.data.result}
}

module.exports = {get_offers_list}