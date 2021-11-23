const {Server} = require('../../models')

function create_server(name, ip, port, status){
	let server = new Server({
		name: name,
    	ip: ip,
    	port: port,
    	status: status
	})
	server.save((err, doc) => {
		if (!err)
			console.log('Server added successfully!')
		else
			console.log('Error during record insertion : ' + err)
  	});
}

module.exports = {create_server}