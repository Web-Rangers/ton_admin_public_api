const {Service, Page} = require('../../models')

function add_page(serviceId, pageName, response_status, response_time){
    let query = Service.findById(serviceId)
    query.exec(function(err,service){
	  	if (!err){
            let page = service.pages.find(item => item.name = pageName)
            console.log(page.months[0]);
            //console.log('Page added successfully!')
        }
        else
           console.log('Error during record insertion : ' + err)
    });
}

module.exports = {add_page}