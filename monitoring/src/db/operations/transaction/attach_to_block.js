import {database_config} from '../../dbaccess'

function attach_to_block(blockId, hash, from, to, message, coins, date){
    let {BlockTransaction,Block} = database_config.status_conn.models
	let transaction = new BlockTransaction({
		hash: hash,
        from: from,
        to: to,
        message: message,
        coins: coins,
        date: date
	})
    Block.findByIdAndUpdate(blockId, {"$push": { 'transactions': transaction }}, function(err, data) {
	 	if (!err)
            console.log('Block Transaction added successfully!')
        else
            console.log('Error during record insertion : ' + err)
    }); 
}

export {attach_to_block}