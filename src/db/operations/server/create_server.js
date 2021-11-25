const {Server} = require('../../models')

function create_server(ip, port, time){
	let server = new Server({
    	ip: ip,
    	port: port,
    	time: time,
		status: time ? true : false
	})
	server.save((err, doc) => {
	 	if (!err)
	  		console.log('Server added successfully!')
	 	else
	  		console.log('Error during record insertion : ' + err)
  	});
}

module.exports = {create_server}