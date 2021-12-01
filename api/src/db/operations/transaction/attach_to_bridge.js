import {Bridge, Web3BridgeTransaction, TonBridgeTransaction} from '../../models'

function attach_web3_to_bridge(bridgeId, hash, from, to, method, ton_address, coins, date){
	let transaction = new Web3BridgeTransaction({
		hash: hash,
        from: from,
        to: to,
        method: method,
        ton_address: ton_address,
        coins: coins,
        date: date
	})
    Bridge.findByIdAndUpdate(bridgeId, {"$push": { 'web3_transactions': transaction }}, function(err, data) {
	 	if (!err)
            console.log('Bridge Web3 Transaction added successfully!')
        else
            console.log('Error during record insertion : ' + err)
    }); 
}

function attach_ton_to_bridge(bridgeId, hash, from, to, message, coins, date){
	let transaction = new TonBridgeTransaction({
		hash: hash,
        from: from,
        to: to,
        message: message,
        coins: coins,
        date: date
	})
    Bridge.findByIdAndUpdate(bridgeId, {"$push": { 'ton_transactions': transaction }}, function(err, data) {
	 	if (!err)
            console.log('Bridge Ton Transaction added successfully!')
        else
            console.log('Error during record insertion : ' + err)
    }); 
}

export {attach_web3_to_bridge, attach_ton_to_bridge}