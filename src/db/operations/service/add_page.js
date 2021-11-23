const {Service, Page} = require('../../models')

function add_page(serviceId, url, status, ping){
	let page = new Page({
		url: url,
		status: status,
        ping: ping
	})
    Service.findByIdAndUpdate(serviceId, {"$push": { 'pages': page }}, function(err, data) {
	 	if (!err)
            console.log('Page added successfully!')
        else
            console.log('Error during record insertion : ' + err)
    }); 
}

module.exports = {add_page}