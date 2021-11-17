const {sendJRPC} = require('../../helpers/jsonrpc')

async function get_elections_data() {
    let status = await sendJRPC('/','status')
    let result = status.data.result
    return { 'id': result.startNextElection,'start':result.startElection, 'end': result.endElection, 'next': result.startNextElection }
}

module.exports = {get_elections_data}