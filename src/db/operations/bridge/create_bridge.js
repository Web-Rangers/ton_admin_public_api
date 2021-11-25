const {Bridge} = require('../../models')

function create_bridge(name, url, transactions = []){
	let bridge = new Bridge({
		name: name,
		url: url,
		transactions: transactions
	})
	bridge.save((err, doc) => {
		if (!err)
			console.log('Bridge added successfully!')
		else
			console.log('Error during record insertion : ' + err)
  	});
}

module.exports = {create_bridge}