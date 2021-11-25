const {Block} = require('../../models')

function create_block(block_id){
	let block = new Block({
		block_id: block_id
	})
	block.save((err, doc) => {
		if (!err)
			console.log('Block added successfully!')
		else
			console.log('Error during record insertion : ' + err)
  	});
}

module.exports = {create_block}